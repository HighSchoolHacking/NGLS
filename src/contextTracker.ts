/**
 * How a command affects the context stack.
 */
export interface IContextChange {
    /**
     * Command to add to the stack, if any.
     */
    enter?: string;

    /**
     * Command to remove from the stack, if any.
     */
    exit?: string;
}

/**
 * Tracks a command context stack.
 */
export interface IContextTracker {
    /**
     * Current state of the tracked context.
     */
    readonly context: string[];

    /**
     * Adds a change to the tracked context.
     *
     * @param change   Change in the context.
     */
    change(change: IContextChange): void;
}

/**
 * Tracks a command context stack.
 */
export class ContextTracker implements IContextTracker {
    /**
     * Current context stack.
     */
    public readonly context: string[] = [];

    /**
     * Marks a change in the stack.
     *
     * @param change   How a command changes the stack.
     */
    public change(change: IContextChange): void {
        if (change.exit !== undefined) {
            this.context.splice(this.context.lastIndexOf(change.exit), 1);
        }

        if (change.enter !== undefined) {
            this.context.push(change.enter);
        }
    }
}
