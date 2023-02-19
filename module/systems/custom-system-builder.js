import { f, getNestedData, sGet, t } from "../utils.js";

const fraction = function (token) {
	const hpPath = sGet("core.custom.FractionHP");
	const hp = getNestedData(token, hpPath) || token.actor.system.attributes?.hp || token.actor.system.hp;
	const thpPath = sGet("custom-system-builder.tempHP");
	const temp = thpPath && token.actor.type === "character" ? getNestedData(token, thpPath).temp : 0;

	if (hp === undefined && hpPath === "") throw new Error(`The HP is undefined, try using the ${game.i18n.localize("healthEstimate.core.custom.FractionHP.name")} setting.`);
	else if (hp === undefined) throw new Error(`The ${game.i18n.localize("healthEstimate.core.custom.FractionHP.name")} setting ("${hpPath}") is wrong.`);
	else if (hp.max === undefined) throw new Error(`Token ${token.name}'s HP has no maximum value. Set it up if you intend for the estimation to work.`);
	const outputs = [Math.min((hp.value + temp) / hp.max, 1), (hp.max - hp.value) / hp.max];
	return outputs[sGet("core.custom.FractionMath")];
};
const settings = () => {
	return {
		"core.custom.FractionHP": {
			hint: f("custom-system-builder.FractionHP.hint", { dataPath1: '"actor.system.attributeBar.hp"', dataPath2: '"actor.system.attributeBar.health"' }),
			type: String,
			default: "",
		},
		"custom-system-builder.tempHP": {
			hint: f("custom-system-builder.tempHP.hint", { setting: t("core.custom.FractionHP.name") }),
			type: String,
			default: "",
		},
		"core.custom.FractionMath": {
			type: Number,
			default: 0,
			choices: {
				0: t("core.custom.FractionMath.choices.0"),
				1: t("core.custom.FractionMath.choices.1"),
			},
		},
		"core.breakOnZeroMaxHP": {
			type: Boolean,
			default: true,
		},
	};
};

export { fraction, settings };
