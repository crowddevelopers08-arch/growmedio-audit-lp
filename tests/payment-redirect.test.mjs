import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(
  fs.readFileSync(new URL("../components/payment/PayButton.tsx", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }
).outputText;

const success = {
  razorpay_order_id: "order_test",
  razorpay_payment_id: "pay_test",
  razorpay_signature: "test_signature",
};

async function checkout(verify, alreadyPaid = false) {
  const redirects = [];
  const state = [];
  let options;
  let timer;
  let cleared = false;
  let verifyCalls = 0;
  const exports = {};
  const jsx = (type, props) => ({ type, props });
  vm.runInNewContext(source, {
    exports,
    AbortController,
    window: {
      Razorpay: function (value) {
        options = value;
        this.open = () => {};
        this.on = () => {};
      },
      location: { replace: (url) => redirects.push(url) },
      setTimeout: (callback) => { timer = callback; return 1; },
      clearTimeout: () => { cleared = true; },
    },
    fetch: async (url, init) => {
      if (url.endsWith("create-order")) {
        return { ok: true, json: async () => ({ orderId: "order_test", alreadyPaid }) };
      }
      verifyCalls++;
      return verify(init, () => timer());
    },
    require: (name) => {
      if (name === "react") return {
        useEffect: () => {},
        useRef: (current) => ({ current }),
        useState: (value) => [value, (next) => state.push(next)],
      };
      if (name === "react/jsx-runtime") return { jsx, jsxs: jsx };
      if (name.endsWith("CtaButton")) return { ctaClass: () => "" };
      if (name.endsWith("site")) return { SITE: { name: "Test" }, SESSION_PRICE_LABEL: "199" };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  const tree = exports.default({ leadId: "lead_test" });
  await tree.props.children[0].props.onClick();
  return { redirects, state, options, cleared: () => cleared, verifyCalls: () => verifyCalls };
}

test("verified payment performs a full-page redirect and ignores modal dismissal", async () => {
  const flow = await checkout(async () => ({ ok: true, status: 200, json: async () => ({ verified: true }) }));
  await flow.options.handler(success);
  flow.options.modal.ondismiss();
  await flow.options.handler(success);
  assert.deepEqual(flow.redirects, ["/thank-you?order=order_test"]);
  assert.equal(flow.verifyCalls(), 1);
  assert.equal(flow.cleared(), true);
  assert.equal(flow.state.some((s) => s.includes("cancelled")), false);
});

for (const status of [500, 504, 429]) {
  test(`HTTP ${status} recovers on the server-rendered status page`, async () => {
    const flow = await checkout(async () => ({ ok: false, status, json: async () => { throw new Error("HTML error"); } }));
    await flow.options.handler(success);
    assert.deepEqual(flow.redirects, ["/thank-you?order=order_test"]);
  });
}

test("network failure recovers on the status page", async () => {
  const flow = await checkout(async () => { throw new TypeError("Failed to fetch"); });
  await flow.options.handler(success);
  assert.deepEqual(flow.redirects, ["/thank-you?order=order_test"]);
});

test("hung verification is aborted and redirects", async () => {
  const flow = await checkout((init, expire) => new Promise((resolve, reject) => {
    init.signal.addEventListener("abort", () => reject(new Error("Aborted")));
    expire();
  }));
  await flow.options.handler(success);
  assert.deepEqual(flow.redirects, ["/thank-you?order=order_test"]);
  assert.equal(flow.cleared(), true);
});

test("explicit verification rejection remains an error", async () => {
  const flow = await checkout(async () => ({ ok: false, status: 400, json: async () => ({ verified: false, error: "Invalid signature" }) }));
  await flow.options.handler(success);
  assert.deepEqual(flow.redirects, []);
  assert.ok(flow.state.includes("Invalid signature"));
});

test("already-paid order redirects without reopening checkout", async () => {
  const flow = await checkout(() => { throw new Error("Unexpected verification"); }, true);
  assert.deepEqual(flow.redirects, ["/thank-you?order=order_test"]);
  assert.equal(flow.options, undefined);
});
