// MyComponent.test.js
import { describe, expect, test, beforeAll } from "vitest";
import { render } from '@testing-library/vue'
import PtjPrimary from './../components/ptj-primary.vue'
import client from "./../js/client.js"

beforeAll(() => {
  client.initSettings({ "url" : "https://api.presstojam.com" });
});

test('it should work', () => {
  const { getByText } = render(PtjPrimary, {
    props: {
      /* ... */
    }
  })

  // assert output
  //getByText('...')
});