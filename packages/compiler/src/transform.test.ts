import { describe, expect, it } from "vitest";
import { transform, TransformOptions } from "./transform";
import { tokenize } from "./tokenizer";

describe("transform", () => {
    const OPTION: TransformOptions = {
        noLambdaTypeToVariable: true,
        noWrappedFunction: true,
        noImplicitCaptureGlobalVariable: true,
    };

    it("should return null when given text node.", () => {
        const [token] = tokenize("hello!").children;
        const transformed = transform(token, OPTION);

        expect(transformed).toBeNull();
    });

    it("should return null when given comment node.", function () {
        const [token] = tokenize("{{! its comment }}").children;
        const transformed = transform(token, OPTION);

        expect(transformed).toBeNull();
    });

    it("should return null when given delimiter node.", function () {
        const [token] = tokenize("{{=<% %>=}}").children;
        const transformed = transform(token, OPTION);

        expect(transformed).toBeNull();
    });

    it("should return null when given partial node.", function () {
        const [token] = tokenize("{{> user}}").children;
        const transformed = transform(token, OPTION);

        expect(transformed).toBeNull();
    });

    it("should return null when given invertedSection node.", function () {
        const [token] = tokenize("{{^user}}sorry...{{/user}}").children;
        const transformed = transform(token, OPTION);

        expect(transformed).toBeNull();
    });
});
