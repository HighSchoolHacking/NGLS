import { ICommand } from "../../../command";

export class Command implements ICommand<{}> {
    public render() {
        return {
            contextChange: {
                exit: true,
            },
            lines: [
                ["for each end"],
            ],
        };
    }
}
