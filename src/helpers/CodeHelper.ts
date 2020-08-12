import {createPrinter, Decorator, MethodDeclaration, Printer, TextRange} from "typescript";

export type ExpressionElementType = {
    text: string;
};

export interface ExpressionArgumentType extends TextRange {
    text: string;
    elements: Array<ExpressionElementType>;
}

export type ExpressionType = {
    expression: {
        escapedText: string;
    };
    arguments: Array<ExpressionArgumentType>;
};

export abstract class CodeHelper {

    protected printer: Printer = createPrinter();

    protected getStepTexts(method: MethodDeclaration): Array<string> {
        const dec = (method.decorators as unknown) as Array<Decorator>;
        const stepDecExp = (dec.filter(this.isStepDecorator)[0]
            .expression as unknown) as ExpressionType;
        const arg = stepDecExp.arguments[0];

        if (!arg.text && arg.elements) {
            return arg.elements.map((e) => {
                return e.text;
            });
        }

        return [arg.text];
    }

    protected isStepDecorator(d: Decorator): boolean {
        const decExp = (d.expression as unknown) as ExpressionType;

        return decExp.expression.escapedText === "Step";
    }

    protected hasStepDecorator(method: MethodDeclaration): boolean {
        return !!method.decorators && method.decorators.some(this.isStepDecorator);
    }

    protected hasStepText(method: MethodDeclaration, stepText: string): boolean {
        const dec = (method.decorators as unknown) as Array<Decorator>;
        const stepDecExp = (dec.filter(this.isStepDecorator)[0]
            .expression as unknown) as ExpressionType;
        const arg = stepDecExp.arguments[0];

        if (!arg.text && arg.elements) {
            return arg.elements.some((e) => {
                return e.text === stepText;
            });
        }

        return arg.text === stepText;
    }

}
