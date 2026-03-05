/**
 * SHRINE AI - Chat Message Component
 * 
 * Individual message bubble with provider badge, streaming cursor,
 * and markdown-like formatting.
 * 
 * Logic:
 * 1. Render user messages right-aligned, assistant left-aligned
 * 2. Show provider badge with icon and color
 * 3. Animate streaming with a blinking cursor
 * 4. Fade-in animation via Framer Motion
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Bot, Sparkles, Brain, User, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChatMessage as ChatMessageType, MODEL_CONFIGS, ModelProvider } from '@/types/ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

const ICON_MAP: Record<string, React.ElementType> = {
    Zap,
    Bot,
    Sparkles,
    Brain,
};

interface ChatMessageProps {
    message: ChatMessageType;
    index: number;
}

// Utility function to detect code-like patterns and wrap them if the model forgets backticks
function detectAndWrapCodeBlocks(text: string): string {
    if (!text) return text;
    if (text.includes('```')) return text;

    const lines = text.split('\n');
    let inCodeBlock = false;
    const processedLines: string[] = [];
    const codeKeywords = /^(import |export |const |let |var |function |class |interface |type |\s*if\s*\(|\s*for\s*\(|\s*while\s*\()/;
    const codeEndings = /([{};,])\s*$/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const looksLikeCode = codeKeywords.test(line) || codeEndings.test(line);
        const isEmpty = line.trim() === '';

        if (!inCodeBlock) {
            if (looksLikeCode && !isEmpty) {
                inCodeBlock = true;
                processedLines.push('\n```javascript');
                processedLines.push(line);
            } else {
                processedLines.push(line);
            }
        } else {
            const nextLineNotCode = (i + 1 < lines.length) && lines[i + 1].trim() !== '' && !codeKeywords.test(lines[i + 1]) && !codeEndings.test(lines[i + 1]) && !lines[i + 1].startsWith('  ') && !lines[i + 1].startsWith('\t');

            if (isEmpty && nextLineNotCode) {
                inCodeBlock = false;
                processedLines.push('```\n');
                processedLines.push(line);
            } else {
                processedLines.push(line);
            }
        }
    }

    if (inCodeBlock) {
        processedLines.push('\n```');
    }

    return processedLines.join('\n');
}

export function ChatMessageBubble({ message, index }: ChatMessageProps): React.JSX.Element {
    const isUser = message.role === 'user';
    const config = message.provider ? MODEL_CONFIGS[message.provider] : null;
    const ProviderIcon = config ? ICON_MAP[config.icon] : null;

    const [copiedFull, setCopiedFull] = useState(false);

    const handleCopyFull = () => {
        navigator.clipboard.writeText(message.content || '');
        setCopiedFull(true);
        setTimeout(() => setCopiedFull(false), 2000);
    };

    const formattedContent = !isUser ? detectAndWrapCodeBlocks(message.content || '') : message.content;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${isUser
                    ? 'bg-amber-400/20 text-amber-400'
                    : config
                        ? `bg-gradient-to-br from-zinc-800 to-zinc-900 ${config.color}`
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
            >
                {isUser ? (
                    <User className="h-4 w-4" />
                ) : ProviderIcon ? (
                    <ProviderIcon className="h-4 w-4" />
                ) : (
                    <Bot className="h-4 w-4" />
                )}
            </div>

            {/* Message Bubble */}
            <div
                className={`max-w-[80%] space-y-1 ${isUser ? 'items-end text-right' : 'items-start'
                    }`}
            >
                {/* Provider Badge */}
                {!isUser && config && (
                    <Badge
                        variant="outline"
                        className={`border-zinc-800 bg-zinc-900/50 text-[10px] ${config.color}`}
                    >
                        {config.name}
                    </Badge>
                )}

                {/* Content */}
                <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                        ? 'bg-amber-400/10 text-amber-100'
                        : 'bg-zinc-900/80 text-zinc-200 border border-zinc-800/50 w-full'
                        }`}
                >
                    {!message.content ? (
                        <span className="text-zinc-500 italic">Thinking...</span>
                    ) : (
                        <div className="prose prose-invert max-w-none break-words prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-p:my-1 prose-p:whitespace-pre-wrap">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    code({ className, children, node, inline, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const isInline = inline !== undefined ? inline : (!match && !String(children).includes('\n'));
                                        return !isInline ? (
                                            <CodeBlock language={match?.[1] || ''} value={String(children).replace(/\n$/, '')} />
                                        ) : (
                                            <code className={`${className || ''} bg-zinc-800 text-amber-100 rounded px-1.5 py-0.5 text-xs font-mono`} {...props}>
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            >
                                {formattedContent}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* Streaming Cursor */}
                    {message.isStreaming && (
                        <motion.span
                            className="ml-0.5 inline-block h-4 w-[2px] bg-amber-400 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                        />
                    )}
                </div>

                {/* Global Copy full response for Assistant messages */}
                {!isUser && !message.isStreaming && message.content && (
                    <div className="flex justify-start">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyFull}
                            className="mt-1 h-7 px-2 text-xs text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/50"
                        >
                            {copiedFull ? (
                                <>
                                    <Check className="h-3 w-3 mr-1.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3 w-3 mr-1.5" />
                                    Copy Full Response
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
