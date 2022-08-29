/* tslint:disable */
/* eslint-disable */

import assert from 'assert';
import nativetype from '../json0';
import fuzzer from 'ot-fuzzer';

nativetype.registerSubtype({
  name: 'mock',
  transform(a, b, side) {
    return {
      mock: true,
    };
  },
});

const transformX = function (type, left, right) {
  return [type.transform(left, right, 'left'), type.transform(right, left, 'right')];
};

const genTests = function (type) {
  describe('sanity', function () {
    describe('#create()', function () {
      it('returns null', function () {
        assert.deepEqual(type.create(), null);
      });
    });
    describe('#compose()', function () {
      it('od,oi --> od+oi', function () {
        assert.deepEqual([
          {
            p: ['foo'],
            od: 1,
            oi: 2,
          },
        ], type.compose([
          {
            p: ['foo'],
            od: 1,
          },
        ], [
          {
            p: ['foo'],
            oi: 2,
          },
        ]));
        assert.deepEqual([
          {
            p: ['foo'],
            od: 1,
          }, {
            p: ['bar'],
            oi: 2,
          },
        ], type.compose([
          {
            p: ['foo'],
            od: 1,
          },
        ], [
          {
            p: ['bar'],
            oi: 2,
          },
        ]));
      });
      it('merges od+oi, od+oi -> od+oi', function () {
        assert.deepEqual([
          {
            p: ['foo'],
            od: 1,
            oi: 2,
          },
        ], type.compose([
          {
            p: ['foo'],
            od: 1,
            oi: 3,
          },
        ], [
          {
            p: ['foo'],
            od: 3,
            oi: 2,
          },
        ]));
      });
    });
    describe('#transform()', function () {
      it('returns sane values', function () {
        let t;
        t = function (op1, op2) {
          assert.deepEqual(op1, type.transform(op1, op2, 'left'));
          assert.deepEqual(op1, type.transform(op1, op2, 'right'));
        };
        t([], []);
        t([
          {
            p: ['foo'],
            oi: 1,
          },
        ], []);
        t([
          {
            p: ['foo'],
            oi: 1,
          },
        ], [
          {
            p: ['bar'],
            oi: 2,
          },
        ]);
      });
    });
  });
  describe('number', function () {
    it('Adds a number', function () {
      assert.deepEqual(3, type.apply(1, [
        {
          p: [],
          na: 2,
        },
      ]));
      assert.deepEqual([3], type.apply([1], [
        {
          p: [0],
          na: 2,
        },
      ]));
    });
    it('compresses two adds together in compose', function () {
      assert.deepEqual([
        {
          p: ['a', 'b'],
          na: 3,
        },
      ], type.compose([
        {
          p: ['a', 'b'],
          na: 1,
        },
      ], [
        {
          p: ['a', 'b'],
          na: 2,
        },
      ]));
      assert.deepEqual([
        {
          p: ['a'],
          na: 1,
        }, {
          p: ['b'],
          na: 2,
        },
      ], type.compose([
        {
          p: ['a'],
          na: 1,
        },
      ], [
        {
          p: ['b'],
          na: 2,
        },
      ]));
    });
    it('doesn\'t overwrite values when it merges na in append', function () {
      const rightHas = 21;
      const leftHas = 3;
      const rightOp = [
        {
          p: [],
          od: 0,
          oi: 15,
        }, {
          p: [],
          na: 4,
        }, {
          p: [],
          na: 1,
        }, {
          p: [],
          na: 1,
        },
      ];
      const leftOp = [
        {
          p: [],
          na: 4,
        }, {
          p: [],
          na: -1,
        },
      ];
      const ref = transformX(type, rightOp, leftOp);
      const right_ = ref[0];
      const left_ = ref[1];
      const s_c = type.apply(rightHas, left_);
      const c_s = type.apply(leftHas, right_);
      assert.deepEqual(s_c, c_s);
    });
  });
  describe('string', function () {
    describe('#apply()', function () {
      it('works', function () {
        assert.deepEqual('abc', type.apply('a', [
          {
            p: [1],
            si: 'bc',
          },
        ]));
        assert.deepEqual('bc', type.apply('abc', [
          {
            p: [0],
            sd: 'a',
          },
        ]));
        assert.deepEqual({
          x: 'abc',
        }, type.apply({
          x: 'a',
        }, [
          {
            p: ['x', 1],
            si: 'bc',
          },
        ]));
      });
    });
    describe('#transform()', function () {
      it('splits deletes', function () {
        assert.deepEqual(type.transform([
          {
            p: [0],
            sd: 'ab',
          },
        ], [
          {
            p: [1],
            si: 'x',
          },
        ], 'left'), [
          {
            p: [0],
            sd: 'a',
          }, {
            p: [1],
            sd: 'b',
          },
        ]);
      });
      it('cancels out other deletes', function () {
        assert.deepEqual(type.transform([
          {
            p: ['k', 5],
            sd: 'a',
          },
        ], [
          {
            p: ['k', 5],
            sd: 'a',
          },
        ], 'left'), []);
      });
      it('does not throw errors with blank inserts', function () {
        assert.deepEqual(type.transform([
          {
            p: ['k', 5],
            si: '',
          },
        ], [
          {
            p: ['k', 3],
            si: 'a',
          },
        ], 'left'), []);
      });
    });
  });
  describe('string subtype', function () {
    describe('#apply()', function () {
      it('works', function () {
        assert.deepEqual('abc', type.apply('a', [
          {
            p: [],
            t: 'text0',
            o: [
              {
                p: 1,
                i: 'bc',
              },
            ],
          },
        ]));
        assert.deepEqual('bc', type.apply('abc', [
          {
            p: [],
            t: 'text0',
            o: [
              {
                p: 0,
                d: 'a',
              },
            ],
          },
        ]));
        assert.deepEqual({
          x: 'abc',
        }, type.apply({
          x: 'a',
        }, [
          {
            p: ['x'],
            t: 'text0',
            o: [
              {
                p: 1,
                i: 'bc',
              },
            ],
          },
        ]));
      });
    });
    describe('#transform()', function () {
      it('splits deletes', function () {
        let a, b;
        a = [
          {
            p: [],
            t: 'text0',
            o: [
              {
                p: 0,
                d: 'ab',
              },
            ],
          },
        ];
        b = [
          {
            p: [],
            t: 'text0',
            o: [
              {
                p: 1,
                i: 'x',
              },
            ],
          },
        ];
        assert.deepEqual(type.transform(a, b, 'left'), [
          {
            p: [],
            t: 'text0',
            o: [
              {
                p: 0,
                d: 'a',
              }, {
                p: 1,
                d: 'b',
              },
            ],
          },
        ]);
      });
      it('cancels out other deletes', function () {
        assert.deepEqual(type.transform([
          {
            p: ['k'],
            t: 'text0',
            o: [
              {
                p: 5,
                d: 'a',
              },
            ],
          },
        ], [
          {
            p: ['k'],
            t: 'text0',
            o: [
              {
                p: 5,
                d: 'a',
              },
            ],
          },
        ], 'left'), []);
      });
      it('does not throw errors with blank inserts', function () {
        assert.deepEqual(type.transform([
          {
            p: ['k'],
            t: 'text0',
            o: [
              {
                p: 5,
                i: '',
              },
            ],
          },
        ], [
          {
            p: ['k'],
            t: 'text0',
            o: [
              {
                p: 3,
                i: 'a',
              },
            ],
          },
        ], 'left'), []);
      });
    });
  });
  describe('subtype with non-array operation', function () {
    describe('#transform()', function () {
      it('works', function () {
        let a, b;
        a = [
          {
            p: [],
            t: 'mock',
            o: 'foo',
          },
        ];
        b = [
          {
            p: [],
            t: 'mock',
            o: 'bar',
          },
        ];
        assert.deepEqual(type.transform(a, b, 'left'), [
          {
            p: [],
            t: 'mock',
            o: {
              mock: true,
            },
          },
        ]);
      });
    });
  });
  describe('list', function () {
    describe('apply', function () {
      it('inserts', function () {
        assert.deepEqual(['a', 'b', 'c'], type.apply(['b', 'c'], [
          {
            p: [0],
            li: 'a',
          },
        ]));
        assert.deepEqual(['a', 'b', 'c'], type.apply(['a', 'c'], [
          {
            p: [1],
            li: 'b',
          },
        ]));
        assert.deepEqual(['a', 'b', 'c'], type.apply(['a', 'b'], [
          {
            p: [2],
            li: 'c',
          },
        ]));
      });
      it('deletes', function () {
        assert.deepEqual(['b', 'c'], type.apply(['a', 'b', 'c'], [
          {
            p: [0],
            ld: 'a',
          },
        ]));
        assert.deepEqual(['a', 'c'], type.apply(['a', 'b', 'c'], [
          {
            p: [1],
            ld: 'b',
          },
        ]));
        assert.deepEqual(['a', 'b'], type.apply(['a', 'b', 'c'], [
          {
            p: [2],
            ld: 'c',
          },
        ]));
      });
      it('replaces', function () {
        assert.deepEqual(['a', 'y', 'b'], type.apply(['a', 'x', 'b'], [
          {
            p: [1],
            ld: 'x',
            li: 'y',
          },
        ]));
      });
      it('moves', function () {
        assert.deepEqual(['a', 'b', 'c'], type.apply(['b', 'a', 'c'], [
          {
            p: [1],
            lm: 0,
          },
        ]));
        assert.deepEqual(['a', 'b', 'c'], type.apply(['b', 'a', 'c'], [
          {
            p: [0],
            lm: 1,
          },
        ]));
      });

      /*
      'null moves compose to nops', ->
        assert.deepEqual [], type.compose [], [{p:[3],lm:3}]
        assert.deepEqual [], type.compose [], [{p:[0,3],lm:3}]
        assert.deepEqual [], type.compose [], [{p:['x','y',0],lm:0}]
       */
    });
    describe('#transform()', function () {
      it('bumps paths when list elements are inserted or removed', function () {
        assert.deepEqual([
          {
            p: [2, 200],
            si: 'hi',
          },
        ], type.transform([
          {
            p: [1, 200],
            si: 'hi',
          },
        ], [
          {
            p: [0],
            li: 'x',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [1, 201],
            si: 'hi',
          },
        ], type.transform([
          {
            p: [0, 201],
            si: 'hi',
          },
        ], [
          {
            p: [0],
            li: 'x',
          },
        ], 'right'));
        assert.deepEqual([
          {
            p: [0, 202],
            si: 'hi',
          },
        ], type.transform([
          {
            p: [0, 202],
            si: 'hi',
          },
        ], [
          {
            p: [1],
            li: 'x',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [2],
            t: 'text0',
            o: [
              {
                p: 200,
                i: 'hi',
              },
            ],
          },
        ], type.transform([
          {
            p: [1],
            t: 'text0',
            o: [
              {
                p: 200,
                i: 'hi',
              },
            ],
          },
        ], [
          {
            p: [0],
            li: 'x',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [1],
            t: 'text0',
            o: [
              {
                p: 201,
                i: 'hi',
              },
            ],
          },
        ], type.transform([
          {
            p: [0],
            t: 'text0',
            o: [
              {
                p: 201,
                i: 'hi',
              },
            ],
          },
        ], [
          {
            p: [0],
            li: 'x',
          },
        ], 'right'));
        assert.deepEqual([
          {
            p: [0],
            t: 'text0',
            o: [
              {
                p: 202,
                i: 'hi',
              },
            ],
          },
        ], type.transform([
          {
            p: [0],
            t: 'text0',
            o: [
              {
                p: 202,
                i: 'hi',
              },
            ],
          },
        ], [
          {
            p: [1],
            li: 'x',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [0, 203],
            si: 'hi',
          },
        ], type.transform([
          {
            p: [1, 203],
            si: 'hi',
          },
        ], [
          {
            p: [0],
            ld: 'x',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [0, 204],
            si: 'hi',
          },
        ], type.transform([
          {
            p: [0, 204],
            si: 'hi',
          },
        ], [
          {
            p: [1],
            ld: 'x',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: ['x', 3],
            si: 'hi',
          },
        ], type.transform([
          {
            p: ['x', 3],
            si: 'hi',
          },
        ], [
          {
            p: ['x', 0, 'x'],
            li: 0,
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: ['x', 3, 'x'],
            si: 'hi',
          },
        ], type.transform([
          {
            p: ['x', 3, 'x'],
            si: 'hi',
          },
        ], [
          {
            p: ['x', 5],
            li: 0,
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: ['x', 4, 'x'],
            si: 'hi',
          },
        ], type.transform([
          {
            p: ['x', 3, 'x'],
            si: 'hi',
          },
        ], [
          {
            p: ['x', 0],
            li: 0,
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [0],
            t: 'text0',
            o: [
              {
                p: 203,
                i: 'hi',
              },
            ],
          },
        ], type.transform([
          {
            p: [1],
            t: 'text0',
            o: [
              {
                p: 203,
                i: 'hi',
              },
            ],
          },
        ], [
          {
            p: [0],
            ld: 'x',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [0],
            t: 'text0',
            o: [
              {
                p: 204,
                i: 'hi',
              },
            ],
          },
        ], type.transform([
          {
            p: [0],
            t: 'text0',
            o: [
              {
                p: 204,
                i: 'hi',
              },
            ],
          },
        ], [
          {
            p: [1],
            ld: 'x',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: ['x'],
            t: 'text0',
            o: [
              {
                p: 3,
                i: 'hi',
              },
            ],
          },
        ], type.transform([
          {
            p: ['x'],
            t: 'text0',
            o: [
              {
                p: 3,
                i: 'hi',
              },
            ],
          },
        ], [
          {
            p: ['x', 0, 'x'],
            li: 0,
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [1],
            ld: 2,
          },
        ], type.transform([
          {
            p: [0],
            ld: 2,
          },
        ], [
          {
            p: [0],
            li: 1,
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [1],
            ld: 2,
          },
        ], type.transform([
          {
            p: [0],
            ld: 2,
          },
        ], [
          {
            p: [0],
            li: 1,
          },
        ], 'right'));
      });
      it('converts ops on deleted elements to noops', function () {
        assert.deepEqual([], type.transform([
          {
            p: [1, 0],
            si: 'hi',
          },
        ], [
          {
            p: [1],
            ld: 'x',
          },
        ], 'left'));
        assert.deepEqual([], type.transform([
          {
            p: [1],
            t: 'text0',
            o: [
              {
                p: 0,
                i: 'hi',
              },
            ],
          },
        ], [
          {
            p: [1],
            ld: 'x',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [0],
            li: 'x',
          },
        ], type.transform([
          {
            p: [0],
            li: 'x',
          },
        ], [
          {
            p: [0],
            ld: 'y',
          },
        ], 'left'));
        assert.deepEqual([], type.transform([
          {
            p: [0],
            na: -3,
          },
        ], [
          {
            p: [0],
            ld: 48,
          },
        ], 'left'));
      });
      it('converts ops on replaced elements to noops', function () {
        assert.deepEqual([], type.transform([
          {
            p: [1, 0],
            si: 'hi',
          },
        ], [
          {
            p: [1],
            ld: 'x',
            li: 'y',
          },
        ], 'left'));
        assert.deepEqual([], type.transform([
          {
            p: [1],
            t: 'text0',
            o: [
              {
                p: 0,
                i: 'hi',
              },
            ],
          },
        ], [
          {
            p: [1],
            ld: 'x',
            li: 'y',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [0],
            li: 'hi',
          },
        ], type.transform([
          {
            p: [0],
            li: 'hi',
          },
        ], [
          {
            p: [0],
            ld: 'x',
            li: 'y',
          },
        ], 'left'));
      });
      it('changes deleted data to reflect edits', function () {
        assert.deepEqual([
          {
            p: [1],
            ld: 'abc',
          },
        ], type.transform([
          {
            p: [1],
            ld: 'a',
          },
        ], [
          {
            p: [1, 1],
            si: 'bc',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [1],
            ld: 'abc',
          },
        ], type.transform([
          {
            p: [1],
            ld: 'a',
          },
        ], [
          {
            p: [1],
            t: 'text0',
            o: [
              {
                p: 1,
                i: 'bc',
              },
            ],
          },
        ], 'left'));
      });
      it('Puts the left op first if two inserts are simultaneous', function () {
        assert.deepEqual([
          {
            p: [1],
            li: 'a',
          },
        ], type.transform([
          {
            p: [1],
            li: 'a',
          },
        ], [
          {
            p: [1],
            li: 'b',
          },
        ], 'left'));
        assert.deepEqual([
          {
            p: [2],
            li: 'b',
          },
        ], type.transform([
          {
            p: [1],
            li: 'b',
          },
        ], [
          {
            p: [1],
            li: 'a',
          },
        ], 'right'));
      });
      it('converts an attempt to re-delete a list element into a no-op', function () {
        assert.deepEqual([], type.transform([
          {
            p: [1],
            ld: 'x',
          },
        ], [
          {
            p: [1],
            ld: 'x',
          },
        ], 'left'));
        assert.deepEqual([], type.transform([
          {
            p: [1],
            ld: 'x',
          },
        ], [
          {
            p: [1],
            ld: 'x',
          },
        ], 'right'));
      });
    });
    describe('#compose()', function () {
      it('composes insert then delete into a no-op', function () {
        assert.deepEqual([], type.compose([
          {
            p: [1],
            li: 'abc',
          },
        ], [
          {
            p: [1],
            ld: 'abc',
          },
        ]));
        assert.deepEqual([
          {
            p: [1],
            ld: null,
            li: 'x',
          },
        ], type.transform([
          {
            p: [0],
            ld: null,
            li: 'x',
          },
        ], [
          {
            p: [0],
            li: 'The',
          },
        ], 'right'));
      });
      it('doesn\'t change the original object', function () {
        let a;
        a = [
          {
            p: [0],
            ld: 'abc',
            li: null,
          },
        ];
        assert.deepEqual([
          {
            p: [0],
            ld: 'abc',
          },
        ], type.compose(a, [
          {
            p: [0],
            ld: null,
          },
        ]));
        assert.deepEqual([
          {
            p: [0],
            ld: 'abc',
            li: null,
          },
        ], a);
      });
      it('composes together adjacent string ops', function () {
        assert.deepEqual([
          {
            p: [100],
            si: 'hi',
          },
        ], type.compose([
          {
            p: [100],
            si: 'h',
          },
        ], [
          {
            p: [101],
            si: 'i',
          },
        ]));
        assert.deepEqual([
          {
            p: [],
            t: 'text0',
            o: [
              {
                p: 100,
                i: 'hi',
              },
            ],
          },
        ], type.compose([
          {
            p: [],
            t: 'text0',
            o: [
              {
                p: 100,
                i: 'h',
              },
            ],
          },
        ], [
          {
            p: [],
            t: 'text0',
            o: [
              {
                p: 101,
                i: 'i',
              },
            ],
          },
        ]));
      });
    });
    it('moves ops on a moved element with the element', function () {
      assert.deepEqual([
        {
          p: [10],
          ld: 'x',
        },
      ], type.transform([
        {
          p: [4],
          ld: 'x',
        },
      ], [
        {
          p: [4],
          lm: 10,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [10, 1],
          si: 'a',
        },
      ], type.transform([
        {
          p: [4, 1],
          si: 'a',
        },
      ], [
        {
          p: [4],
          lm: 10,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [10],
          t: 'text0',
          o: [
            {
              p: 1,
              i: 'a',
            },
          ],
        },
      ], type.transform([
        {
          p: [4],
          t: 'text0',
          o: [
            {
              p: 1,
              i: 'a',
            },
          ],
        },
      ], [
        {
          p: [4],
          lm: 10,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [10, 1],
          li: 'a',
        },
      ], type.transform([
        {
          p: [4, 1],
          li: 'a',
        },
      ], [
        {
          p: [4],
          lm: 10,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [10, 1],
          ld: 'b',
          li: 'a',
        },
      ], type.transform([
        {
          p: [4, 1],
          ld: 'b',
          li: 'a',
        },
      ], [
        {
          p: [4],
          lm: 10,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [0],
          li: null,
        },
      ], type.transform([
        {
          p: [0],
          li: null,
        },
      ], [
        {
          p: [0],
          lm: 1,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [6],
          li: 'x',
        },
      ], type.transform([
        {
          p: [5],
          li: 'x',
        },
      ], [
        {
          p: [5],
          lm: 1,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [1],
          ld: 6,
        },
      ], type.transform([
        {
          p: [5],
          ld: 6,
        },
      ], [
        {
          p: [5],
          lm: 1,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [0],
          li: [],
        },
      ], type.transform([
        {
          p: [0],
          li: [],
        },
      ], [
        {
          p: [1],
          lm: 0,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [2],
          li: 'x',
        },
      ], type.transform([
        {
          p: [2],
          li: 'x',
        },
      ], [
        {
          p: [0],
          lm: 1,
        },
      ], 'left'));
    });
    it('moves target index on ld/li', function () {
      assert.deepEqual([
        {
          p: [0],
          lm: 1,
        },
      ], type.transform([
        {
          p: [0],
          lm: 2,
        },
      ], [
        {
          p: [1],
          ld: 'x',
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [1],
          lm: 3,
        },
      ], type.transform([
        {
          p: [2],
          lm: 4,
        },
      ], [
        {
          p: [1],
          ld: 'x',
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [0],
          lm: 3,
        },
      ], type.transform([
        {
          p: [0],
          lm: 2,
        },
      ], [
        {
          p: [1],
          li: 'x',
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [3],
          lm: 5,
        },
      ], type.transform([
        {
          p: [2],
          lm: 4,
        },
      ], [
        {
          p: [1],
          li: 'x',
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [1],
          lm: 1,
        },
      ], type.transform([
        {
          p: [0],
          lm: 0,
        },
      ], [
        {
          p: [0],
          li: 28,
        },
      ], 'left'));
    });
    it('tiebreaks lm vs. ld/li', function () {
      assert.deepEqual([], type.transform([
        {
          p: [0],
          lm: 2,
        },
      ], [
        {
          p: [0],
          ld: 'x',
        },
      ], 'left'));
      assert.deepEqual([], type.transform([
        {
          p: [0],
          lm: 2,
        },
      ], [
        {
          p: [0],
          ld: 'x',
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [1],
          lm: 3,
        },
      ], type.transform([
        {
          p: [0],
          lm: 2,
        },
      ], [
        {
          p: [0],
          li: 'x',
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [1],
          lm: 3,
        },
      ], type.transform([
        {
          p: [0],
          lm: 2,
        },
      ], [
        {
          p: [0],
          li: 'x',
        },
      ], 'right'));
    });
    it('replacement vs. deletion', function () {
      assert.deepEqual([
        {
          p: [0],
          li: 'y',
        },
      ], type.transform([
        {
          p: [0],
          ld: 'x',
          li: 'y',
        },
      ], [
        {
          p: [0],
          ld: 'x',
        },
      ], 'right'));
    });
    it('replacement vs. insertion', function () {
      assert.deepEqual([
        {
          p: [1],
          ld: {},
          li: 'brillig',
        },
      ], type.transform([
        {
          p: [0],
          ld: {},
          li: 'brillig',
        },
      ], [
        {
          p: [0],
          li: 36,
        },
      ], 'left'));
    });
    it('replacement vs. replacement', function () {
      assert.deepEqual([], type.transform([
        {
          p: [0],
          ld: null,
          li: [],
        },
      ], [
        {
          p: [0],
          ld: null,
          li: 0,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [0],
          ld: [],
          li: 0,
        },
      ], type.transform([
        {
          p: [0],
          ld: null,
          li: 0,
        },
      ], [
        {
          p: [0],
          ld: null,
          li: [],
        },
      ], 'left'));
    });
    it('composes replace with delete of replaced element results in insert', function () {
      assert.deepEqual([
        {
          p: [2],
          ld: [],
        },
      ], type.compose([
        {
          p: [2],
          ld: [],
          li: null,
        },
      ], [
        {
          p: [2],
          ld: null,
        },
      ]));
    });
    it('lm vs lm', function () {
      assert.deepEqual([
        {
          p: [0],
          lm: 2,
        },
      ], type.transform([
        {
          p: [0],
          lm: 2,
        },
      ], [
        {
          p: [2],
          lm: 1,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [4],
          lm: 4,
        },
      ], type.transform([
        {
          p: [3],
          lm: 3,
        },
      ], [
        {
          p: [5],
          lm: 0,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [2],
          lm: 0,
        },
      ], type.transform([
        {
          p: [2],
          lm: 0,
        },
      ], [
        {
          p: [1],
          lm: 0,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [2],
          lm: 1,
        },
      ], type.transform([
        {
          p: [2],
          lm: 0,
        },
      ], [
        {
          p: [1],
          lm: 0,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [3],
          lm: 1,
        },
      ], type.transform([
        {
          p: [2],
          lm: 0,
        },
      ], [
        {
          p: [5],
          lm: 0,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [3],
          lm: 0,
        },
      ], type.transform([
        {
          p: [2],
          lm: 0,
        },
      ], [
        {
          p: [5],
          lm: 0,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [0],
          lm: 5,
        },
      ], type.transform([
        {
          p: [2],
          lm: 5,
        },
      ], [
        {
          p: [2],
          lm: 0,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [0],
          lm: 5,
        },
      ], type.transform([
        {
          p: [2],
          lm: 5,
        },
      ], [
        {
          p: [2],
          lm: 0,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [0],
          lm: 0,
        },
      ], type.transform([
        {
          p: [1],
          lm: 0,
        },
      ], [
        {
          p: [0],
          lm: 5,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [0],
          lm: 0,
        },
      ], type.transform([
        {
          p: [1],
          lm: 0,
        },
      ], [
        {
          p: [0],
          lm: 1,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [1],
          lm: 1,
        },
      ], type.transform([
        {
          p: [0],
          lm: 1,
        },
      ], [
        {
          p: [1],
          lm: 0,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [1],
          lm: 2,
        },
      ], type.transform([
        {
          p: [0],
          lm: 1,
        },
      ], [
        {
          p: [5],
          lm: 0,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [3],
          lm: 2,
        },
      ], type.transform([
        {
          p: [2],
          lm: 1,
        },
      ], [
        {
          p: [5],
          lm: 0,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [2],
          lm: 1,
        },
      ], type.transform([
        {
          p: [3],
          lm: 1,
        },
      ], [
        {
          p: [1],
          lm: 3,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [2],
          lm: 3,
        },
      ], type.transform([
        {
          p: [1],
          lm: 3,
        },
      ], [
        {
          p: [3],
          lm: 1,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [2],
          lm: 6,
        },
      ], type.transform([
        {
          p: [2],
          lm: 6,
        },
      ], [
        {
          p: [0],
          lm: 1,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [2],
          lm: 6,
        },
      ], type.transform([
        {
          p: [2],
          lm: 6,
        },
      ], [
        {
          p: [0],
          lm: 1,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [2],
          lm: 6,
        },
      ], type.transform([
        {
          p: [2],
          lm: 6,
        },
      ], [
        {
          p: [1],
          lm: 0,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [2],
          lm: 6,
        },
      ], type.transform([
        {
          p: [2],
          lm: 6,
        },
      ], [
        {
          p: [1],
          lm: 0,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [0],
          lm: 2,
        },
      ], type.transform([
        {
          p: [0],
          lm: 1,
        },
      ], [
        {
          p: [2],
          lm: 1,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [2],
          lm: 0,
        },
      ], type.transform([
        {
          p: [2],
          lm: 1,
        },
      ], [
        {
          p: [0],
          lm: 1,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [1],
          lm: 1,
        },
      ], type.transform([
        {
          p: [0],
          lm: 0,
        },
      ], [
        {
          p: [1],
          lm: 0,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [0],
          lm: 0,
        },
      ], type.transform([
        {
          p: [0],
          lm: 1,
        },
      ], [
        {
          p: [1],
          lm: 3,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [3],
          lm: 1,
        },
      ], type.transform([
        {
          p: [2],
          lm: 1,
        },
      ], [
        {
          p: [3],
          lm: 2,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [3],
          lm: 3,
        },
      ], type.transform([
        {
          p: [3],
          lm: 2,
        },
      ], [
        {
          p: [2],
          lm: 1,
        },
      ], 'left'));
    });
    it('changes indices correctly around a move', function () {
      assert.deepEqual([
        {
          p: [1, 0],
          li: {},
        },
      ], type.transform([
        {
          p: [0, 0],
          li: {},
        },
      ], [
        {
          p: [1],
          lm: 0,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [0],
          lm: 0,
        },
      ], type.transform([
        {
          p: [1],
          lm: 0,
        },
      ], [
        {
          p: [0],
          ld: {},
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [0],
          lm: 0,
        },
      ], type.transform([
        {
          p: [0],
          lm: 1,
        },
      ], [
        {
          p: [1],
          ld: {},
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [5],
          lm: 0,
        },
      ], type.transform([
        {
          p: [6],
          lm: 0,
        },
      ], [
        {
          p: [2],
          ld: {},
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [1],
          lm: 0,
        },
      ], type.transform([
        {
          p: [1],
          lm: 0,
        },
      ], [
        {
          p: [2],
          ld: {},
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [1],
          lm: 1,
        },
      ], type.transform([
        {
          p: [2],
          lm: 1,
        },
      ], [
        {
          p: [1],
          ld: 3,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [1],
          ld: {},
        },
      ], type.transform([
        {
          p: [2],
          ld: {},
        },
      ], [
        {
          p: [1],
          lm: 2,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [2],
          ld: {},
        },
      ], type.transform([
        {
          p: [1],
          ld: {},
        },
      ], [
        {
          p: [2],
          lm: 1,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [0],
          ld: {},
        },
      ], type.transform([
        {
          p: [1],
          ld: {},
        },
      ], [
        {
          p: [0],
          lm: 1,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [0],
          ld: 1,
          li: 2,
        },
      ], type.transform([
        {
          p: [1],
          ld: 1,
          li: 2,
        },
      ], [
        {
          p: [1],
          lm: 0,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [0],
          ld: 2,
          li: 3,
        },
      ], type.transform([
        {
          p: [1],
          ld: 2,
          li: 3,
        },
      ], [
        {
          p: [0],
          lm: 1,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [1],
          ld: 3,
          li: 4,
        },
      ], type.transform([
        {
          p: [0],
          ld: 3,
          li: 4,
        },
      ], [
        {
          p: [1],
          lm: 0,
        },
      ], 'left'));
    });
    it('li vs lm', function () {
      let li, lm, xf;
      li = function (p) {
        return [
          {
            p: [p],
            li: [],
          },
        ];
      };
      lm = function (f, t) {
        return [
          {
            p: [f],
            lm: t,
          },
        ];
      };
      xf = type.transform;
      assert.deepEqual(li(0), xf(li(0), lm(1, 3), 'left'));
      assert.deepEqual(li(1), xf(li(1), lm(1, 3), 'left'));
      assert.deepEqual(li(1), xf(li(2), lm(1, 3), 'left'));
      assert.deepEqual(li(2), xf(li(3), lm(1, 3), 'left'));
      assert.deepEqual(li(4), xf(li(4), lm(1, 3), 'left'));
      assert.deepEqual(lm(2, 4), xf(lm(1, 3), li(0), 'right'));
      assert.deepEqual(lm(2, 4), xf(lm(1, 3), li(1), 'right'));
      assert.deepEqual(lm(1, 4), xf(lm(1, 3), li(2), 'right'));
      assert.deepEqual(lm(1, 4), xf(lm(1, 3), li(3), 'right'));
      assert.deepEqual(lm(1, 3), xf(lm(1, 3), li(4), 'right'));
      assert.deepEqual(li(0), xf(li(0), lm(1, 2), 'left'));
      assert.deepEqual(li(1), xf(li(1), lm(1, 2), 'left'));
      assert.deepEqual(li(1), xf(li(2), lm(1, 2), 'left'));
      assert.deepEqual(li(3), xf(li(3), lm(1, 2), 'left'));
      assert.deepEqual(li(0), xf(li(0), lm(3, 1), 'left'));
      assert.deepEqual(li(1), xf(li(1), lm(3, 1), 'left'));
      assert.deepEqual(li(3), xf(li(2), lm(3, 1), 'left'));
      assert.deepEqual(li(4), xf(li(3), lm(3, 1), 'left'));
      assert.deepEqual(li(4), xf(li(4), lm(3, 1), 'left'));
      assert.deepEqual(lm(4, 2), xf(lm(3, 1), li(0), 'right'));
      assert.deepEqual(lm(4, 2), xf(lm(3, 1), li(1), 'right'));
      assert.deepEqual(lm(4, 1), xf(lm(3, 1), li(2), 'right'));
      assert.deepEqual(lm(4, 1), xf(lm(3, 1), li(3), 'right'));
      assert.deepEqual(lm(3, 1), xf(lm(3, 1), li(4), 'right'));
      assert.deepEqual(li(0), xf(li(0), lm(2, 1), 'left'));
      assert.deepEqual(li(1), xf(li(1), lm(2, 1), 'left'));
      assert.deepEqual(li(3), xf(li(2), lm(2, 1), 'left'));
      assert.deepEqual(li(3), xf(li(3), lm(2, 1), 'left'));
    });
  });
  describe('object', function () {
    it('passes sanity checks', function () {
      assert.deepEqual({
        x: 'a',
        y: 'b',
      }, type.apply({
        x: 'a',
      }, [
        {
          p: ['y'],
          oi: 'b',
        },
      ]));
      assert.deepEqual({}, type.apply({
        x: 'a',
      }, [
        {
          p: ['x'],
          od: 'a',
        },
      ]));
      assert.deepEqual({
        x: 'b',
      }, type.apply({
        x: 'a',
      }, [
        {
          p: ['x'],
          od: 'a',
          oi: 'b',
        },
      ]));
    });
    it('Ops on deleted elements become noops', function () {
      assert.deepEqual([], type.transform([
        {
          p: [1, 0],
          si: 'hi',
        },
      ], [
        {
          p: [1],
          od: 'x',
        },
      ], 'left'));
      assert.deepEqual([], type.transform([
        {
          p: [1],
          t: 'text0',
          o: [
            {
              p: 0,
              i: 'hi',
            },
          ],
        },
      ], [
        {
          p: [1],
          od: 'x',
        },
      ], 'left'));
      assert.deepEqual([], type.transform([
        {
          p: [9],
          si: 'bite ',
        },
      ], [
        {
          p: [],
          od: 'agimble s',
          oi: null,
        },
      ], 'right'));
      assert.deepEqual([], type.transform([
        {
          p: [],
          t: 'text0',
          o: [
            {
              p: 9,
              i: 'bite ',
            },
          ],
        },
      ], [
        {
          p: [],
          od: 'agimble s',
          oi: null,
        },
      ], 'right'));
    });
    it('Ops on replaced elements become noops', function () {
      assert.deepEqual([], type.transform([
        {
          p: [1, 0],
          si: 'hi',
        },
      ], [
        {
          p: [1],
          od: 'x',
          oi: 'y',
        },
      ], 'left'));
      assert.deepEqual([], type.transform([
        {
          p: [1],
          t: 'text0',
          o: [
            {
              p: 0,
              i: 'hi',
            },
          ],
        },
      ], [
        {
          p: [1],
          od: 'x',
          oi: 'y',
        },
      ], 'left'));
    });
    it('Deleted data is changed to reflect edits', function () {
      assert.deepEqual([
        {
          p: [1],
          od: 'abc',
        },
      ], type.transform([
        {
          p: [1],
          od: 'a',
        },
      ], [
        {
          p: [1, 1],
          si: 'bc',
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [1],
          od: 'abc',
        },
      ], type.transform([
        {
          p: [1],
          od: 'a',
        },
      ], [
        {
          p: [1],
          t: 'text0',
          o: [
            {
              p: 1,
              i: 'bc',
            },
          ],
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [],
          od: 25,
          oi: [],
        },
      ], type.transform([
        {
          p: [],
          od: 22,
          oi: [],
        },
      ], [
        {
          p: [],
          na: 3,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [],
          od: {
            toves: '',
          },
          oi: 4,
        },
      ], type.transform([
        {
          p: [],
          od: {
            toves: 0,
          },
          oi: 4,
        },
      ], [
        {
          p: ['toves'],
          od: 0,
          oi: '',
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [],
          od: 'thou an',
          oi: [],
        },
      ], type.transform([
        {
          p: [],
          od: 'thou and ',
          oi: [],
        },
      ], [
        {
          p: [7],
          sd: 'd ',
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: [],
          od: 'thou an',
          oi: [],
        },
      ], type.transform([
        {
          p: [],
          od: 'thou and ',
          oi: [],
        },
      ], [
        {
          p: [],
          t: 'text0',
          o: [
            {
              p: 7,
              d: 'd ',
            },
          ],
        },
      ], 'left'));
      assert.deepEqual([], type.transform([
        {
          p: ['bird'],
          na: 2,
        },
      ], [
        {
          p: [],
          od: {
            bird: 38,
          },
          oi: 20,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [],
          od: {
            bird: 40,
          },
          oi: 20,
        },
      ], type.transform([
        {
          p: [],
          od: {
            bird: 38,
          },
          oi: 20,
        },
      ], [
        {
          p: ['bird'],
          na: 2,
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: ['He'],
          od: [],
        },
      ], type.transform([
        {
          p: ['He'],
          od: [],
        },
      ], [
        {
          p: ['The'],
          na: -3,
        },
      ], 'right'));
      assert.deepEqual([], type.transform([
        {
          p: ['He'],
          oi: {},
        },
      ], [
        {
          p: [],
          od: {},
          oi: 'the',
        },
      ], 'left'));
    });
    it('If two inserts are simultaneous, the lefts insert will win', function () {
      assert.deepEqual([
        {
          p: [1],
          oi: 'a',
          od: 'b',
        },
      ], type.transform([
        {
          p: [1],
          oi: 'a',
        },
      ], [
        {
          p: [1],
          oi: 'b',
        },
      ], 'left'));
      assert.deepEqual([], type.transform([
        {
          p: [1],
          oi: 'b',
        },
      ], [
        {
          p: [1],
          oi: 'a',
        },
      ], 'right'));
    });
    it('parallel ops on different keys miss each other', function () {
      assert.deepEqual([
        {
          p: ['a'],
          oi: 'x',
        },
      ], type.transform([
        {
          p: ['a'],
          oi: 'x',
        },
      ], [
        {
          p: ['b'],
          oi: 'z',
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: ['a'],
          oi: 'x',
        },
      ], type.transform([
        {
          p: ['a'],
          oi: 'x',
        },
      ], [
        {
          p: ['b'],
          od: 'z',
        },
      ], 'left'));
      assert.deepEqual([
        {
          p: ['in', 'he'],
          oi: {},
        },
      ], type.transform([
        {
          p: ['in', 'he'],
          oi: {},
        },
      ], [
        {
          p: ['and'],
          od: {},
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: ['x', 0],
          si: 'his ',
        },
      ], type.transform([
        {
          p: ['x', 0],
          si: 'his ',
        },
      ], [
        {
          p: ['y'],
          od: 0,
          oi: 1,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: ['x'],
          t: 'text0',
          o: [
            {
              p: 0,
              i: 'his ',
            },
          ],
        },
      ], type.transform([
        {
          p: ['x'],
          t: 'text0',
          o: [
            {
              p: 0,
              i: 'his ',
            },
          ],
        },
      ], [
        {
          p: ['y'],
          od: 0,
          oi: 1,
        },
      ], 'right'));
    });
    it('replacement vs. deletion', function () {
      assert.deepEqual([
        {
          p: [],
          oi: {},
        },
      ], type.transform([
        {
          p: [],
          od: [''],
          oi: {},
        },
      ], [
        {
          p: [],
          od: [''],
        },
      ], 'right'));
    });
    it('replacement vs. replacement', function () {
      let leftHas, leftOps, left_, ref, rightHas, rightOps, right_;
      assert.deepEqual([], type.transform([
        {
          p: [],
          od: [''],
        }, {
          p: [],
          oi: {},
        },
      ], [
        {
          p: [],
          od: [''],
        }, {
          p: [],
          oi: null,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [],
          od: null,
          oi: {},
        },
      ], type.transform([
        {
          p: [],
          od: [''],
        }, {
          p: [],
          oi: {},
        },
      ], [
        {
          p: [],
          od: [''],
        }, {
          p: [],
          oi: null,
        },
      ], 'left'));
      assert.deepEqual([], type.transform([
        {
          p: [],
          od: [''],
          oi: {},
        },
      ], [
        {
          p: [],
          od: [''],
          oi: null,
        },
      ], 'right'));
      assert.deepEqual([
        {
          p: [],
          od: null,
          oi: {},
        },
      ], type.transform([
        {
          p: [],
          od: [''],
          oi: {},
        },
      ], [
        {
          p: [],
          od: [''],
          oi: null,
        },
      ], 'left'));
      rightOps = [
        {
          p: [],
          od: null,
          oi: {},
        },
      ];
      leftOps = [
        {
          p: [],
          od: null,
          oi: '',
        },
      ];
      rightHas = type.apply(null, rightOps);
      leftHas = type.apply(null, leftOps);
      ref = transformX(type, leftOps, rightOps);
      left_ = ref[0];
      right_ = ref[1];
      assert.deepEqual(leftHas, type.apply(rightHas, left_));
      assert.deepEqual(leftHas, type.apply(leftHas, right_));
    });
    it('An attempt to re-delete a key becomes a no-op', function () {
      assert.deepEqual([], type.transform([
        {
          p: ['k'],
          od: 'x',
        },
      ], [
        {
          p: ['k'],
          od: 'x',
        },
      ], 'left'));
      assert.deepEqual([], type.transform([
        {
          p: ['k'],
          od: 'x',
        },
      ], [
        {
          p: ['k'],
          od: 'x',
        },
      ], 'right'));
    });
  });
  describe.skip('randomizer', function () {
    // this.timeout(20000);
    // this.slow(6000);
    it('passes', function () {
      fuzzer(type, require('./json0_generator'), 1000);
    });
    it('passes with string subtype', function () {
      type._testStringSubtype = true;
      fuzzer(type, require('./json0_generator'), 1000);
      delete type._testStringSubtype;
    });
  });
};

describe('json', function () {
  describe('native type', function () {
    genTests(nativetype);
  });
});

// ---
// generated by coffee-script 1.9.2
