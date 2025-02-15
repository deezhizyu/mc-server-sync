function choicePrompt() {
  const choice = prompt(`(y/N)`);

  return choice?.toLowerCase() === "y";
}

export default choicePrompt;
