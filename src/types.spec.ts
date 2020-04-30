import { parse } from "./parsers";
import { EbriScrapConfig } from "./types";

function assert<T>(_arg: T) {}

const html = '<p>Test</p>';

/**
 * No assertion here. If it compiles, it works !
 */
describe('Types', () => {
    it('should infer correct type', () => {
        assert<string>(
            parse(html, 'p')
        );

        assert<{ test: string }>(
            parse(html, { test: 'a' })
        );

        assert<string[]>(
            parse(html, [{ containerSelector: 'a', itemSelector: 'a', data: 'a' }])
        );

        assert<{ test: string }[]>(
            parse(html, [{ containerSelector: 'a', itemSelector: 'a', data: { test : 's' } }])
        );
    })

    it('should have correct return type when using ObjectConfig', () => {
        interface Data1 {
            a: string;
            b: string;
            c: string;
        }
        const config1: EbriScrapConfig<Data1> = {
            a: 'a',
            b: 'b',
            c: 'c',
        };
        assert<Data1>(
            parse(html, config1)
        );
    })

    it('should have correct return type when using ArrayConfig', () => {
        type Data2 = string[];
        const config1: EbriScrapConfig<Data2> = [
            {
                containerSelector: 'a',
                itemSelector: 'a',
                data: 'a'
            }
        ];

        assert<Data2>(parse(html, config1));
        assert<EbriScrapConfig<Data2>>(config1);
        assert<EbriScrapConfig>(config1);
    })

    it('should infer correct config', () => {
        const config1 = [
            {
                containerSelector: 'a',
                itemSelector: 'a',
                data: 'a'
            }
        ];

        assert<EbriScrapConfig<string[]>>(config1);
        assert<EbriScrapConfig>(config1);
    })

    it('should infer correct config', () => {
        const config1 = [
            {
                containerSelector: 'a',
                itemSelector: 'a',
                data: { test: 'a' }
            }
        ];

        assert<EbriScrapConfig<{ test: string }[]>>(config1);
        assert<EbriScrapConfig>(config1);
    })
})