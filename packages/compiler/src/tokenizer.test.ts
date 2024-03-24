import { describe, it, expect, vi } from "vitest";
import { InvertedSection, NonFalseValue, tokenize } from "./tokenizer";
import mustache from "mustache";

describe("tokenize", () => {
    it("should return text when given 'hello!'", () => {
        const [token] = tokenize("hello!").children;

        expect(token).not.toBeUndefined();
        expect(token.type).toMatch("text");
        expect(token.value).toMatch("hello!");
    });

    it.each([
        ["{{ name }}", "variable", "name"],
        ["{{{ name }}}", "variable", "name"],
    ])(`should return variable when given "%s"`, (testCase, type, name) => {
        const [token] = tokenize(testCase).children;

        expect(token).not.toBeUndefined();
        expect(token.type).toMatch(type);
        expect(token.value).toMatch(name);
    });

    it("should return section when given '{{#user}}{{name}}{{/user}}'", () => {
        const [token] = tokenize("{{#user}}{{name}}{{/user}}").children;

        expect(token).not.toBeUndefined();
        expect(token.type).toMatch("section");
    });

    it("should return inverted section when given '{{^user}}sorry...{{/user}}'", () => {
        const [token] = tokenize("{{^user}}sorry...{{/user}}").children;

        expect(token).not.toBeUndefined();
        expect(token.type).toMatch("invertedSection");
        expect((<InvertedSection>token).children).toHaveLength(1);
        expect((<InvertedSection>token).children[0].value).toMatch("sorry...");
    });

    it("should return nonFalseValue when given '{{#user?}}hello{{/user?}}'", () => {
        const [token] = tokenize("{{#user?}}hello{{/user?}}").children;

        expect(token).not.toBeUndefined();
        expect(token.type).toMatch("nonFalseValue");

        expect((<NonFalseValue>token).children).toHaveLength(1);
    });

    it("should return comment when given '{{! its comment }}'", () => {
        const [token] = tokenize("{{! its comment }}").children;

        expect(token).not.toBeUndefined();
        expect(token.type).toMatch("comment");
    });

    it("should return partial when given '{{> user}}'", () => {
        const [token] = tokenize("{{> user}}").children;

        expect(token).not.toBeUndefined();
        expect(token.type).toMatch("partial");
    });

    it("should return delimiter when given '{{=<% %>=}}'", () => {
        const [token] = tokenize("{{=<% %>=}}").children;

        expect(token).not.toBeUndefined();
        expect(token.type).toMatch("delimiter");
    });

    it("should throw Error", () => {
        const spy = vi.spyOn(mustache, "parse");
        spy.mockReturnValue(["+" as any, "error", 0, 1]);

        expect(() => tokenize("")).toThrowError("Unreachable Statement");
    });
});
