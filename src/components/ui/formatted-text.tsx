import React from 'react';
import { cn } from '@/lib/utils';

interface FormattedTextProps {
  content: string;
  className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ content, className }) => {
  // Parse markdown-like content and render with proper formatting
  const renderContent = () => {
    if (!content) return null;

    // Split by double newlines for paragraphs, single newlines for line breaks
    const blocks = content.split(/\n\n+/);

    return blocks.map((block, blockIndex) => {
      const trimmedBlock = block.trim();
      if (!trimmedBlock) return null;

      // Check for headers
      if (trimmedBlock.startsWith('### ')) {
        return (
          <h3 key={blockIndex} className="font-semibold text-base mt-3 mb-1 first:mt-0">
            {trimmedBlock.slice(4)}
          </h3>
        );
      }
      if (trimmedBlock.startsWith('## ')) {
        return (
          <h2 key={blockIndex} className="font-semibold text-lg mt-4 mb-2 first:mt-0">
            {trimmedBlock.slice(3)}
          </h2>
        );
      }
      if (trimmedBlock.startsWith('# ')) {
        return (
          <h1 key={blockIndex} className="font-bold text-xl mt-4 mb-2 first:mt-0">
            {trimmedBlock.slice(2)}
          </h1>
        );
      }

      // Check for numbered lists
      if (/^\d+\.\s/.test(trimmedBlock)) {
        const items = trimmedBlock.split(/\n/).filter(line => line.trim());
        return (
          <ol key={blockIndex} className="list-decimal list-inside space-y-1 my-2">
            {items.map((item, itemIndex) => {
              const listContent = item.replace(/^\d+\.\s*/, '');
              return (
                <li key={itemIndex} className="text-sm">
                  {renderInlineFormatting(listContent)}
                </li>
              );
            })}
          </ol>
        );
      }

      // Check for bullet lists
      if (/^[-*•]\s/.test(trimmedBlock)) {
        const items = trimmedBlock.split(/\n/).filter(line => line.trim());
        return (
          <ul key={blockIndex} className="list-disc list-inside space-y-1 my-2">
            {items.map((item, itemIndex) => {
              const listContent = item.replace(/^[-*•]\s*/, '');
              return (
                <li key={itemIndex} className="text-sm">
                  {renderInlineFormatting(listContent)}
                </li>
              );
            })}
          </ul>
        );
      }

      // Check for code blocks
      if (trimmedBlock.startsWith('```')) {
        const codeContent = trimmedBlock.replace(/```\w*\n?/, '').replace(/```$/, '');
        return (
          <pre key={blockIndex} className="bg-muted/50 rounded p-2 my-2 overflow-x-auto">
            <code className="text-xs font-mono">{codeContent}</code>
          </pre>
        );
      }

      // Regular paragraph - handle single line breaks within
      const lines = trimmedBlock.split('\n');
      return (
        <p key={blockIndex} className="text-sm my-2 first:mt-0 last:mb-0">
          {lines.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {renderInlineFormatting(line)}
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  // Handle inline formatting (bold, italic, code, links)
  const renderInlineFormatting = (text: string): React.ReactNode => {
    if (!text) return null;

    // Process inline formatting
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold: **text** or __text__
      const boldMatch = remaining.match(/^(.*?)(\*\*|__)(.+?)\2(.*)$/s);
      if (boldMatch) {
        if (boldMatch[1]) parts.push(boldMatch[1]);
        parts.push(<strong key={key++} className="font-semibold">{boldMatch[3]}</strong>);
        remaining = boldMatch[4];
        continue;
      }

      // Italic: *text* or _text_
      const italicMatch = remaining.match(/^(.*?)(\*|_)([^*_]+)\2(.*)$/s);
      if (italicMatch) {
        if (italicMatch[1]) parts.push(italicMatch[1]);
        parts.push(<em key={key++}>{italicMatch[3]}</em>);
        remaining = italicMatch[4];
        continue;
      }

      // Inline code: `code`
      const codeMatch = remaining.match(/^(.*?)`([^`]+)`(.*)$/s);
      if (codeMatch) {
        if (codeMatch[1]) parts.push(codeMatch[1]);
        parts.push(
          <code key={key++} className="bg-muted/50 px-1 py-0.5 rounded text-xs font-mono">
            {codeMatch[2]}
          </code>
        );
        remaining = codeMatch[3];
        continue;
      }

      // No more formatting found
      parts.push(remaining);
      break;
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={cn("space-y-0", className)}>
      {renderContent()}
    </div>
  );
};
