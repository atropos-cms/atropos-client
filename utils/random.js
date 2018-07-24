/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */

export default class random {
  constructor (seed) {
    this._seed = seed % 2147483647
    if (this._seed <= 0) this._seed += 2147483646
  }

  next () {
    this._seed = this._seed * 16807 % 2147483647
    return this._seed
  }

  nextFloat () {
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return (this.next() - 1) / 2147483646
  }
}
