import { parseConfig } from './config-parsers';

export function validateConfig(config: any): void {
	parseConfig(config);
}
