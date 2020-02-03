# Getting started
You need [Node.js] (at least 12.13.0).

Install all the dependencies with
```
npm install
```

Then you can start the server and the frontend with
```
npm run start
```
Look at the console output to determine the URLs that you can connect to.

# Developing
In development, you might want to have everything running in the background and recompile automatically whenever you save a file. To achieve that, run
```
npm run watch
```

## Technologies
- The project uses [Tone.js] ([API reference](https://tonejs.github.io/docs/14.4.79/Tone)) for producing sounds.
- The frontend is written using [Angular].
- The [Open Sound Control (OSC)](http://opensoundcontrol.org/introduction-osc) protocol is used for networking.

[Node.js]: https://nodejs.org/en/
[Tone.js]: https://tonejs.github.io/
[Angular]: https://angular.io/

## Creating routing controllers for OSC messages
Put your OSC controllers into `Frontend/src/app/generator/library/controllers`. See `Frontend/src/app/generator/library/controllers/logger.ts` for an example.
You must register controllers in `Frontend/src/app/generator/library/controllers/index.ts`.

```typescript
@Controller("/drums")
export class SliderController {

  private kickInstrument: DrumsKick;

  constructor(private foo: Foo, private music: MusicService) {
    this.kickInstrument = this.music.getInstrument('kick') as DrumsKick;
  }

  @OnMessage('/kick')
  public receivedMessage(@Message() message: OSCInputMessage) {
    this.foo.test();
    this.kickInstrument.play(...);
  }

}
```

### Dependency Injection
When your controller depends on an another class, you can inject the dependency via [Dependency Injection](https://www.freecodecamp.org/news/a-quick-intro-to-dependency-injection-what-it-is-and-when-to-use-it-7578c84fa88f/).
You can use Dependency Injection, for example, to get access to the instruments in order to produce sounds.
You can also inject other classes. You can inject the controller's dependencies by adding them to the class as a constructor parameter. 
The injection mechanism automatically creates an singleton instance of this class and then makes it available in all controllers that depend on it as a class attribute.

### Decorators
You must decorate each controller with the `@Controller()` decorator. It takes the namespace as an argument.
If you do not specify a namespace, all OSC messages will be routed to this controller.
Additionally, you must register this controller in `Frontend/src/app/generator/library/controllers/index.ts`.

`@OnMessage('/play')` allows you to decorate methods that should get executed when a message has the specified OSC address url after the namespace.
If you do not specify a url in the decorator, each OSC messages routed to the controller will trigger the execution of the decorated method.

You can get access to the received OSC message by using the `@Message()` decorator. It takes no arguments!

## Deploying
If you want to deploy the project on a raspberry pi refer to the [DEPLOYMENT.md](./DEPLOYMENT.md)

