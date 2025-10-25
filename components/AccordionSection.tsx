"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, MapPin} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Subcategory } from '@/lib/content-loader';

interface AccordionSectionProps {
  subcategories: Subcategory[];
}

export function AccordionSection({ subcategories }: AccordionSectionProps) {
  const renderMarkdown = (content: string) => {
    const isPasteHere = content.includes('PASTE:');

    return (
      <div className={`prose prose-sm max-w-none dark:prose-invert ${
        isPasteHere ? 'text-muted-foreground italic' : ''
      }`}>
        <ReactMarkdown
          components={{
            ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
            p: ({ children }) => <p className="mb-2">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {subcategories.map((sub, index) => (
        <AccordionItem key={index} value={`item-${index}`} id={sub.name.toLowerCase().replace(/\s+/g, '-')}>
          <AccordionTrigger className="text-left hover:text-amber-600 transition-colors">
            <span className="text-lg font-semibold">{sub.name}</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-4">
              {sub.description_md && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Description
                  </h4>
                  {renderMarkdown(sub.description_md)}
                </div>
              )}

              {(sub.phone || sub.location) && (
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  Contact / Location
                </h4>

                {/* Phone */}
                {sub.phone && (
                  <a
                    href={`tel:${sub.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium mb-1"
                  >
                    <Phone className="w-4 h-4" />
                    {sub.phone}
                  </a>
                )}

                {/* Location */}
                {sub.location && (
                  <a
                    href="#"
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    <MapPin className="w-4 h-4" />
                    {sub.location}
                  </a>
                )}
              </div>
            )}

              {sub.financial_value_md && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Financial Value
                  </h4>
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    {renderMarkdown(sub.financial_value_md)}
                  </div>
                </div>
              )}

              {sub.exceptions_md && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Exceptions
                  </h4>
                  {renderMarkdown(sub.exceptions_md)}
                </div>
              )}

              {sub.steps_md && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    How to Access
                  </h4>
                  {renderMarkdown(sub.steps_md)}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
