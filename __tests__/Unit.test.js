/**
 * @jest-environment jsdom
 */

const mainTester = require("../source/main.js")
const routerTester = require("../source/Router.js")

 
 describe('Tests for getUrl in Rourte.js', () => {

    test("getUrl: testing 'home-page'", () => {
      expect(routerTester.getUrl("home")).toBe(window.location.pathname+'/source');
    });
  
     
  })
 
describe('Tests for createCarousel in main.js', () => {

    test("createCarousel: testing ''", () => {
      expect(maintester.createCarousels(Burger,3,Burger,1 ).length()).toBe(3);
    });
  
     
})