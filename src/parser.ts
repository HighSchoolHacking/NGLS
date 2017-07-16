import { ICommand } from "./command";
import { ICommandsAndMatchers } from "./commandsAndMatchers";
import { ContextTracker, IContextTracker } from "./contextTracker";
import { IMatcher } from "./matchers";

/**
 * Parses raw string lines into GLS.
 */
export class Parser {
    /**
     * Commands and their paired matchers by name.
     */
    private readonly commandsAndMatchers: ICommandsAndMatchers;

    /**
     * Initializes a new instance of the Parser class.
     *
     * @param commandsAndMatchers   Commands and their paired matchers by name.
     */
    public constructor(commandsAndMatchers: ICommandsAndMatchers) {
        this.commandsAndMatchers = commandsAndMatchers;
    }

    /**
     * Parses raw lines of text into GLS.
     *
     * @param lines   Raw lines to convert.
     * @returns A Promise for converting the lines.
     */
    public async parseLines(lines: string[]): Promise<string[]> {
        const contextTracker = new ContextTracker();
        const results: string[] = [];

        for (const line of lines) {
            const parsedLine = await this.parseLine(line, contextTracker);

            if (parsedLine === undefined) {
                results.push("");
            } else {
                results.push(...parsedLine);
            }
        }

        return results;
    }

    /**
     * Parses a raw string line into GLS.
     *
     * @param line   A raw string line to convert.
     * @param contextTracker   Tracks the command context stack.
     * @param deep   Whether this is within a recursive command.
     * @returns The equivalent GLS, if possible.
     */
    private async parseLine(line: string, contextTracker: IContextTracker, deep?: true): Promise<string[] | undefined> {
        for (const commandName of Object.keys(this.commandsAndMatchers)) {
            const matchersList = await this.commandsAndMatchers[commandName].matchersList;

            for (const matcher of matchersList.matchers) {
                if (deep !== true && matcher.onlyDeep === true) {
                    continue;
                }

                const match = matcher.test.execute(line, contextTracker);
                if (match === undefined) {
                    continue;
                }

                const command = this.commandsAndMatchers[commandName].command;
                const shallowRendered = command.render(matcher.parseArgs(match), contextTracker);

                if (shallowRendered.contextChange !== undefined) {
                    contextTracker.change(shallowRendered.contextChange);
                }

                return await this.recurseIntoCommand(shallowRendered.lines, contextTracker);
            }
        }

        return undefined;
    }

    /**
     * Recursively renders a command.
     *
     * @param shallowRenderedLines   Lines of GLS or recursive commands.
     * @param contextTracker   Tracks the command context stack.
     * @returns A Promise for lines of GLS.
     */
    private async recurseIntoCommand(shallowRenderedLines: string[][], contextTracker: IContextTracker): Promise<string[]> {
        const realRenderedLines: string[] = [];

        for (const shallowLine of shallowRenderedLines) {
            let realLine = "";

            for (const section of shallowLine) {
                if (section[0] === "{") {
                    const recursion = await this.parseLine(section.slice("{ ".length, section.length - " }".length), contextTracker, true);
                    realLine += `{ ${recursion} }`;
                } else {
                    realLine += section;
                }
            }

            realRenderedLines.push(realLine);
        }

        return realRenderedLines;
    }
}
