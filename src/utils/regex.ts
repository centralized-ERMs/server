export const validateRegex = (expression: string) => {
  const regularExpression = new RegExp(expression);
  return (str: string): RegExpMatchArray | null => {
    return str.match(regularExpression);
  };
};
