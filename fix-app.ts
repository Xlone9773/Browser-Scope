import { API, FileInfo } from 'jscodeshift';

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.JSXExpressionContainer).forEach((path) => {
    const expr = path.node.expression;
    if (expr.type === 'LogicalExpression' && expr.operator === '&&') {
      // Check if the right side is a JSXElement, JSXFragment, or something similar
      // Actually, just change it unconditionally if it's inside a JSX tree.
      path.node.expression = j.conditionalExpression(
        expr.left,
        expr.right,
        j.nullLiteral()
      );
    }
  });

  return root.toSource();
}
