import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CodeBlockProps {
    language: string;
    value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="my-4 overflow-hidden border border-[#FFD700]/20 bg-zinc-950">
            <div className="flex items-center justify-between bg-zinc-900/50 px-4 py-2 border-b border-[#FFD700]/10">
                <span className="text-xs font-mono text-zinc-400 capitalize">{language || 'text'}</span>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleCopy} 
                    className="relative h-6 w-6 text-zinc-400 hover:text-amber-400"
                >
                    <motion.div
                        initial={false}
                        animate={{ scale: copied ? 0 : 1 }}
                        transition={{ duration: 0.1 }}
                        className="absolute"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </motion.div>
                    <motion.div
                        initial={false}
                        animate={{ scale: copied ? 1 : 0 }}
                        transition={{ duration: 0.1 }}
                        className="absolute"
                    >
                        <Check className="h-4 w-4 text-emerald-400" />
                    </motion.div>
                </Button>
            </div>
            <div className="p-0">
                <SyntaxHighlighter
                    language={language || 'text'}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
                    }}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </Card>
    );
}
