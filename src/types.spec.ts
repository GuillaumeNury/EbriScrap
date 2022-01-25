import { parse } from "./parsers";
import { EbriScrapConfig, EbriScrapConfigObject } from "./types";

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

        assert<EbriScrapConfigObject<any>>({ test: 'a' });

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

    it('should have correct return type when using string', () => {
        const config1: EbriScrapConfig<string> = 'a';
        assert<string>(
            parse(html, config1)
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
        const config: EbriScrapConfig<Data2> = [
            {
                containerSelector: 'a',
                itemSelector: 'a',
                data: 'a'
            }
        ];

        assert<Data2>(parse(html, config));
        assert<EbriScrapConfig<Data2>>(config);
        assert<EbriScrapConfig>(config);
    })

    it('should have correct return type when using ArrayConfig', () => {
        type Data3 = { test1: string, test2: string };
        const config: EbriScrapConfig<Data3[]> = [
            {
                containerSelector: 'a',
                itemSelector: 'a',
                data: { test1: 'a', test2: 'a' }
            }
        ];

        assert<Data3[]>(parse(html, config));
        assert<EbriScrapConfig<Data3[]>>(config);
        assert<EbriScrapConfig>(config);
    })

    it('should have correct return type when using ArrayConfig', () => {
        type Data4 = { count: string, scripts: string[] };
        const config = {
          count: ".numAnn | format:number",
          scripts: [
            {
              data: "script | extract:html",
              itemSelector: "script",
              containerSelector: "body"
            }
          ]
        };

        const data = parse(html, config);

        assert<Data4>(data);
        assert<EbriScrapConfig<Data4>>(config);
        assert<EbriScrapConfig>(config);
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