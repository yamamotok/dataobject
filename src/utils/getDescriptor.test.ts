import { getDescriptor } from './getDescriptor';

const simpleObject = {
  name: 'Test',
  get initial() {
    return this.name[0];
  },
};

class Test {
  name = 'Test';
  get initial(): string {
    return this.name[0];
  }
}

class TextExtended extends Test {
  get initialLower(): string {
    return this.name[0].toLowerCase();
  }
}

describe('getDescriptor', () => {
  it('should get a descriptor of a simple object', () => {
    const descriptor = getDescriptor(simpleObject, 'initial');
    expect(descriptor?.get).toBeTruthy();
  });

  it('should get a descriptor of a class instance', () => {
    const descriptor = getDescriptor(new Test(), 'initial');
    expect(descriptor?.get).toBeTruthy();
  });

  it('should get descriptors from both base class and derived class', () => {
    {
      const descriptor = getDescriptor(new TextExtended(), 'initial');
      expect(descriptor?.get).toBeTruthy();
    }
    {
      const descriptor = getDescriptor(new TextExtended(), 'initialLower');
      expect(descriptor?.get).toBeTruthy();
    }
  });
});
