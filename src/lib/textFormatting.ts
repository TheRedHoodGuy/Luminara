export function formatModelResponse(text: string): string {
    return text
      // Handle bold text (**text**)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Handle bullet points
      .replace(/\* /g, '<br/>• ')
      // Handle multiple line breaks
      .replace(/\n\n/g, '<br/><br/>')
      // Handle single line breaks
      .replace(/\n/g, '<br/>');
  }