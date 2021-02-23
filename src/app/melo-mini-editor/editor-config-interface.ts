export interface EditorConfig {
    file?: boolean;
    mentionedNames?: MentionedName[];
    mentionedDates?: string[];
    colorPalette?: boolean;
    buttonName?: string;
    toolbarPlacement?: 'top' | 'bottom';
    placeholder?: string;
}

export interface MentionedName {
    id: number;
    name: string;
}

export interface ToolbarConfig {
    bold?: boolean;
    italic?: boolean;
    strikeThrough?: boolean;
    underline?: boolean;
    orderedList?: boolean;
    unorderedList?: boolean;
    superscript?: boolean;
    subscript?: boolean;
    quote?: boolean;
    fontColor: string;
    backgroundColor: string;
}

