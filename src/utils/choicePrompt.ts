export function choicePrompt() {
  const choice = prompt(`(y/N)`);

  return choice?.toLowerCase() === "y";
}
