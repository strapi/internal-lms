// write a quick remix test script to test unit tests and integration tests

it("should render the home page", async () => {
  const response = await fetch("http://localhost:3000");
  const text = await response.text();
  expect(text).toMatch("Hello, world!");
});
