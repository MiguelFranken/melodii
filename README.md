# Media Computing Project

## Prerequisite
- [Node](https://nodejs.org/en/) (12.13.0 or the latest LTS version of Node)
- [Sonic Pi](https://sonic-pi.net/)
- OSC Controller App (to send osc messages for testing)
    - [iOS](https://apps.apple.com/us/app/clean-osc/id1235192209)
    - [Android](https://play.google.com/store/apps/details?id=com.ffsmultimedia.osccontroller&hl=en)
    
## Backend
### Run
<details>
<summary><strong>See details</strong></summary>

#### Starting the OSC-Server
- `cd 01.OSCServer`
- `npm run start:refresh` or `npm run start` to disable recompiling when detecting source code changes

#### Starting the tone generator
- `cd 03.Generator`
- `npm run start:dev`
- Open a web browser to the provided address (tone generator works only in a browser)

#### OSC controller app for testing
- Start your osc app and connect to the central osc server. IP and port `57121` are logged when starting the server.
</details>

### Creating controllers for the tone generator
<details>
<summary><strong>See details</strong></summary>

Put your OSC controllers into `03.Generator/src/music/controllers`. See `03.Generator/src/music/controllers/logger.ts` for an example.
You must register controllers in `03.Generator/src/music/controllers/index.ts`.

```typescript
@Controller("/clean_slider_1")
export class SliderController {

  constructor(private foo: Foo, private socketServer: SocketServer) {
  }

  @OnMessage()
  public receivedMessage(@Message() message: OSCInputMessage) {
    this.foo.test();
    this.socketServer.emit(Event.SLIDER_UPDATE, Math.round(message.getArgs()[0].value * 100));
  }

}
```

#### Dependency Injection
When your controller depends on an another class, you can inject the dependency via [Dependency Injection](https://www.freecodecamp.org/news/a-quick-intro-to-dependency-injection-what-it-is-and-when-to-use-it-7578c84fa88f/)
You can use Dependency Injection, for example, to get access to the websockets within a controller.
You can also inject other classes. Inject your dependencies by adding them to the class as a constructor parameter. 
The injection mechanism automatically creates an singleton instance of this class and then makes this available in the controller as a class attribute.

#### Decorators
You must decorate each controller with the `@Controller()` decorator. It takes the namespace as an argument.
If you do not specify a namespace, all OSC messages will be routed to this controller.
Additionally, you must register this controller in `03.Generator/src/music/controllers/index.ts`.

`@OnMessage('/play')` allows you to decorate methods that should get executed when a message has the specified OSC address url after the namespace.
If you do not specify a url in the decorator, each OSC messages routed to the controller will trigger the execution of the decorated method.

You can get access to the received OSC message by using the `@Message()` decorator. It takes no arguments!
</details>

## Frontend
### Run
- `cd 02.Frontend` (in new terminal window)
- `npn run start`
- Open your browser and navigate to `http.//localhost:4200`
