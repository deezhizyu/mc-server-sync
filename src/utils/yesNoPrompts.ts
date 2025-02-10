export function yesNoPrompt() {
  const choice = prompt(`(y/N)`);

  return choice?.toLowerCase() === "y";
}
