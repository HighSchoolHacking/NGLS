import { IMatchersList } from "../../matchers";
import { ContextExclusionRequirement } from "../../matchTests/contextExclusionRequirement";
import { ContextMatchRequirement } from "../../matchTests/contextMatchRequirement";
import { RegExpMatchTest } from "../../matchTests/regExpMatchTest";
import { ICommandArgs } from "./command";

export class MatchersList implements IMatchersList {
    public readonly matchers = [
        {
            test: new RegExpMatchTest(
                /(create|make|instantiate|spin up) a new (.+)/i,
                new ContextMatchRequirement("class start"),
                new ContextExclusionRequirement("constructor start")),
            parseArgs(matches: RegExpMatchArray): ICommandArgs {
                return {
                    className: matches[2],
                };
            },
        },
    ];
}
