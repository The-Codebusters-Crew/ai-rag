export function buildPrompt(question: string, contexts: string[]): string {
  const contextText = contexts.map((ctx, idx) => `${idx + 1}. ${ctx}`).join('\n');
  return `Answer the following question using the provided context.\n\nContext:\n${contextText}\n\nQuestion: ${question}\n\nAnswer:`;
}
