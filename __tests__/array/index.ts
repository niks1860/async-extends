import { GetAsyncIterator, MapAsync } from "../../src";

describe("GetAsyncIterator functions coorectly", () => {
    test("calls callback for all elements in array", async () => {
        const iterator = GetAsyncIterator([1, 2, 3, 4, 5], async (el, arr) => {
            return el * 2;
        }, 2);

        const result = [];
        for await (const res of iterator) {
            result.push(res);
        }

        expect(result).toEqual(expect.arrayContaining([2, 4, 6, 8, 10]));
    })
});

describe("MapAsync functions correctly", () => {
    test("MapAsync return transformed array", async () => {
        const result = await MapAsync([1, 3, 5, 7], async el => el + 3);
        expect(result).toEqual(expect.arrayContaining([4, 6, 8, 10]));
    });
})

