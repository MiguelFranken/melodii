# Media Computing Project

## Prerequisite
- [Node](https://nodejs.org/en/) (12.13.0 or the latest LTS version of Node)
- [Sonic Pi](https://sonic-pi.net/)
- OSC Controller App (to send osc messages for testing)
    - [iOS](https://apps.apple.com/us/app/clean-osc/id1235192209)
    - [Android](https://play.google.com/store/apps/details?id=com.ffsmultimedia.osccontroller&hl=en) (not tested yet)
    
## Backend
### Run
#### Sonic Pi
- Start Sonic Pi and copy `01.Backend/sonic-pi.rb` from the project directory into the sonic pi coding environment.
- Activate _"Empfange entfernte OSC-Nachrichten"_ in the sonic pi menu (see `Prefs > I/O`).
- Press on `Run`!
- Copy IP and port of sonic pi into `01.Backend/index.ts` (to specify `outputIp` and `outputPort`).
  
#### Starting the OSC-Server & Socket-Server
- `cd 01.Backend`
- `npm run start:refresh` or `npm run start` to disable recompiling when detecting source code changes

#### Controller app for testing
- Get your local IP address or the IP address on which this server runs on (e.g. `192.168.0.241`)
- Start your app and connect to this IP with port `57121`
- When you press buttons on the Controller App you should now hear piano sounds from sonic pi!

### Creating controllers
Put your OSC controllers into `01.Backend/src/controllers`.

#### Dependency Injection
When your controller depends on an another class, you can inject the dependency via [Dependency Injection](https://www.freecodecamp.org/news/a-quick-intro-to-dependency-injection-what-it-is-and-when-to-use-it-7578c84fa88f/)
You can use Dependency Injection, for example, to get access to the websockets within a controller.
You can also inject other classes. Inject your dependencies by adding them to the class as a constructor parameter. 
The injection mechanism automatically creates an singleton instance of this class and then makes this available in the controller as a class attribute.

#### Decorators
##### `controller`
You must decorate each controller with the `@Controller()` decorator. It takes the namespace as an argument.
If you do not specify a namespace, all OSC messages will be routed to this controller.
Additionally, you must register this controller in `01.Backend/src/controllers/index.ts`.

`@OnMessage('/play')` allows you to decorate methods that should get executed when a message has the specified OSC address url after the namespace.
If you do not specify a url in the decorator, each OSC messages routed to the controller will trigger the execution of the decorated method.

You can get access to the received OSC message by using the `@Message()` decorator. It takes no arguments!

```
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

## Frontend
### Run
- `cd 02.Frontend` (in new terminal window)
- `npn run start`
- Open your browser and navigate to `http.//localhost:4200`
