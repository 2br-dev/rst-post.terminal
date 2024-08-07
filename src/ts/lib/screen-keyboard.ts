interface IKeyboard
{
	shiftPressed: boolean;
	container: HTMLDivElement;
	onKeyPress: (char:string) => void;
	onErase: () => void;
	onCloseStart: () => void;
	onCloseEnd: () => void;
	onOpenStart: () => void;
	onOpenEnd: () => void;
	open: () => void;
	close: () => void;
}

interface IKeyGroup{
	class: string,
	keys: string[]
}

interface IKeyboardConstructorParams
{
	keys?: IKeyGroup[];
	keyboardClassName?: string;
	keyClassName?: string;
}

class Keyboard implements IKeyboard
{
	private keys = [];
	private default_keys:IKeyGroup[] = [
		{
			"class": "line1",
			"keys": [
				'й',
				'ц',
				'у',
				'к',
				'е',
				'н',
				'г',
				'ш',
				'щ',
				'з',
				'х',
				'ъ',
			]
		},
		{
			"class": "line2",
			"keys": [
				'ф',
				'ы',
				'в',
				'а',
				'п',
				'р',
				'о',
				'л',
				'д',
				'ж',
				'э',
			]
		},
		{
			"class": "line3",
			"keys": [
				'я',
				'ч',
				'с',
				'м',
				'и',
				'т',
				'ъ',
				'б',
				'ю',
				'ё',
			]
		},{
			"class": 'controls',
			"keys": [
				'⇧',
				' ',
				'⇐',
			]
		}
	];
	public shiftPressed:boolean;
	public container:HTMLDivElement;
	public onKeyPress = (char:string) => {};
	public onErase = () => {};
	public onCloseStart = () => {};
	public onCloseEnd = () => {};
	public onOpenStart = () => {};
	public onOpenEnd = () => {};

	public constructor(params?: IKeyboardConstructorParams)
	{

		let keyClass:string, kbClass:string;

		if(params)
		{
			this.keys = params.keys ? params.keys : this.default_keys;
			keyClass = params.keyClassName ? params.keyClassName : "key";
			kbClass = params.keyboardClassName ? params.keyboardClassName : "screen-keyboard";
		}else{
			this.keys = this.default_keys;
			keyClass = "key";
			kbClass = "screen-keyboard";
		}

		this.generateDOM(kbClass, keyClass);
	}

	private generateDOM(kbClass:string, keyClass:string)
	{
		this.container = <HTMLDivElement>document.createElement('DIV');
		this.container.classList.add(kbClass);

		let closer = <HTMLButtonElement>document.createElement('DIV');
		closer.classList.add('closer');
		closer.innerText = "Закрыть";
		closer.addEventListener('click', this.close.bind(this));

		this.container.appendChild(closer);
		document.body.appendChild(this.container);

		// Основной набор клавиш
		this.keys.forEach((group:{class:string, keys:string[]}) => {
			let groupContainer = <HTMLDivElement>document.createElement('DIV');
			groupContainer.className = group.class;

			group.keys.forEach(char => {
				let key = new Key(char);
				key.append(groupContainer, keyClass);
				key.onPress = this.onPress.bind(this);
			})

			this.container.append(groupContainer);
		});
	}

	public open()
	{
		this.onOpenStart();
		this.container.classList.add("shown");
		setTimeout(this.onOpenEnd, 400);
	}

	public close()
	{
		
		this.onCloseStart();
		this.container.classList.remove("shown");
		setTimeout(this.onCloseEnd, 400);
	}

	private onPress(char:String)
	{
		let retChar;
		switch(char)
		{
			case("⇐"):
				this.onErase();
				break;
			case("⇧"):
				this.shiftPressed = this.shiftPressed ? false : true;
				if(this.shiftPressed)
				{
					this.container.classList.add('shift');
				}else{
					this.container.classList.remove('shift');
				}
				break;
			default:
				if(this.shiftPressed)
				{
					retChar = char.toUpperCase();
				}else{
					retChar = char;
				}
				this.shiftPressed = false;
				this.container.classList.remove('shift');
		}
		this.onKeyPress(retChar);
	}
}

class Key
{

	public onPress = (char:String) => {};
	private char:string;

	public constructor(char:string)
	{
		this.char = char;
	}

	public append(container:HTMLDivElement, className:string)
	{
		let keyElement:HTMLButtonElement = <HTMLButtonElement>document.createElement('Button');
		keyElement.classList.add(className);
		keyElement.classList.add('touchable');
		keyElement.textContent = this.char;
		switch(this.char)
		{
			case " ":
				keyElement.classList.add('space');
				break;
			case "⇐":
				keyElement.classList.add('long');
				break;
			case "⇧":
				keyElement.classList.add('long');
				keyElement.classList.add('shift');
				break;
		}
		keyElement.addEventListener('click', this.onclick.bind(this));
		keyElement.addEventListener('mousedown', (e:MouseEvent) => {
			(<HTMLElement>e.currentTarget).classList.add('pressed');
		});
		keyElement.addEventListener('mouseup', (e:MouseEvent) => {
			(<HTMLElement>e.currentTarget).classList.remove('pressed');
		});
		container.appendChild(keyElement);
	}

	private onclick(el:HTMLButtonElement)
	{
		this.onPress(this.char);
	}
}

export default Keyboard;
