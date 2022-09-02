// MyComponent.test.js
import { describe, expect, test, beforeAll } from "vitest";
import { render } from '@testing-library/vue'
import PtjRepo from './../components/ptj-repo.vue'
import client from "./../js/client.js"


beforeAll(() => {
  client.initSettings({ "url" : "https://api.presstojam.com" });
});

test('it should work', () => {
  const { getByText } = render(PtjRepo, {
    props: {
      model : 'projects'
    }
  });

  // assert output
  //getByText('...')
});