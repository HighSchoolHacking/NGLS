import { ICommand } from "../../command";

export interface ICommandArgs {
    conditional: string;
}

export class Command implements ICommand<ICommandArgs> {
    public render(args: ICommandArgs) {
        let { conditional } = args;

        if (conditional.indexOf(" ") !== -1) {
            conditional = `{ ${conditional} }`;
        }

        return {
            contextChange: {
                enter: "if start",
            },
            lines: [
                ["if start : ", conditional],
            ],
        };
    }
}
