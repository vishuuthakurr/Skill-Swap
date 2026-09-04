"""Database seeder for Skill-Swap skills and assessment question banks."""
from datetime import datetime, timezone
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skill_swap.settings")
import django
django.setup()

from api.services import mongo_db, ensure_indexes

SKILLS = [
    {
        "id": "skill-python",
        "slug": "python",
        "name": "Python Programming",
        "category": "Software Engineering",
        "description": "Object-oriented programming, data structures, scripting, and backend development with Python.",
        "icon": "Code2",
    },
    {
        "id": "skill-java",
        "slug": "java",
        "name": "Java Programming",
        "category": "Software Engineering",
        "description": "Core Java, JVM architecture, OOP design patterns, collections, and concurrency.",
        "icon": "Coffee",
    },
    {
        "id": "skill-javascript",
        "slug": "javascript",
        "name": "JavaScript & Web Development",
        "category": "Web Development",
        "description": "Modern ECMAScript, asynchronous programming, DOM manipulation, closures, and browser APIs.",
        "icon": "Globe",
    },
]

PYTHON_QUESTIONS = [
    ("What is the output of `type([])` in Python?", ["<class 'tuple'>", "<class 'list'>", "<class 'set'>", "<class 'dict'>"], "<class 'list'>"),
    ("Which keyword is used to define an asynchronous generator in Python?", ["async yield", "async def", "yield from", "await def"], "async def"),
    ("What is the time complexity of looking up a key in an average Python dictionary?", ["O(1)", "O(n)", "O(log n)", "O(n^2)"], "O(1)"),
    ("Which of the following data types is immutable in Python?", ["list", "set", "dict", "tuple"], "tuple"),
    ("What does the `*args` syntax allow in a function definition?", ["Keyword arguments only", "Arbitrary number of positional arguments", "Named parameters only", "Type annotations"], "Arbitrary number of positional arguments"),
    ("What does the `**kwargs` syntax unpack into?", ["A list", "A tuple", "A dictionary", "A generator"], "A dictionary"),
    ("Which built-in function returns both index and item when iterating?", ["zip()", "map()", "enumerate()", "filter()"], "enumerate()"),
    ("What will `bool('False')` evaluate to in Python?", ["False", "True", "None", "ValueError"], "True"),
    ("How do you create a deep copy of a list in Python?", ["list.copy()", "copy.deepcopy(list)", "list[:]", "list(list)"], "copy.deepcopy(list)"),
    ("What is the purpose of the `__init__` method in Python classes?", ["Class destructor", "Instance initializer / constructor", "Static method decorator", "String representation"], "Instance initializer / constructor"),
    ("Which built-in module is used for regular expressions?", ["regex", "pyregex", "re", "regexp"], "re"),
    ("What is the GIL in CPython?", ["Global Inheritance Linker", "General Interface Language", "Global Interpreter Lock", "Global Iteration Loop"], "Global Interpreter Lock"),
    ("What does `[x**2 for x in range(5)]` evaluate to?", ["[1, 4, 9, 16, 25]", "[0, 1, 4, 9, 16]", "[0, 2, 4, 6, 8]", "[1, 2, 3, 4, 5]"], "[0, 1, 4, 9, 16]"),
    ("Which keyword is used to raise an exception manually?", ["throw", "error", "raise", "catch"], "raise"),
    ("What is the result of `3 * 'ab'` in Python?", ["'ababab'", "TypeError", "'a3b3'", "'ab3'"], "'ababab'"),
    ("Which built-in function finds the length of a sequence?", ["size()", "count()", "length()", "len()"], "len()"),
    ("What is a decorator in Python?", ["A GUI styling library", "A function that modifies the behavior of another function", "A database index", "A packaging format"], "A function that modifies the behavior of another function"),
    ("Which block is always executed in a try-except structure if present?", ["finally", "always", "after", "else"], "finally"),
    ("What does `is` check compared to `==`?", ["Value equality", "Object identity (memory address)", "Type equivalence", "String length"], "Object identity (memory address)"),
    ("Which method is called when an object is converted to string for users?", ["__repr__", "__str__", "__to_s__", "__format__"], "__str__"),
    ("What data structure does `collections.deque` provide?", ["Double-ended queue", "Binary search tree", "Hash map", "Priority heap"], "Double-ended queue"),
    ("How do you open a file for reading in text mode safely?", ["with open('file.txt', 'r') as f:", "f = file.open('file.txt')", "open.file('file.txt', mode='read')", "read('file.txt')"], "with open('file.txt', 'r') as f:"),
    ("What will `set([1, 2, 2, 3])` return?", ["{1, 2, 2, 3}", "{1, 2, 3}", "[1, 2, 3]", "(1, 2, 3)"], "{1, 2, 3}"),
    ("Which method adds an element to the end of a list?", ["insert()", "add()", "push()", "append()"], "append()"),
    ("What does the `yield` statement create in a function?", ["A coroutine only", "A generator iterator", "A static method", "A thread"], "A generator iterator"),
    ("What is PEP 8?", ["The Python compiler specification", "The official Python style guide", "A security protocol", "A packaging format"], "The official Python style guide"),
    ("Which module provides unit testing capabilities in the standard library?", ["pytest", "unittest", "testify", "spec"], "unittest"),
    ("What is the result of `10 // 3` in Python 3?", ["3.333", "3", "4", "3.0"], "3"),
    ("How can you remove leading and trailing whitespace from a string?", ["s.trim()", "s.strip()", "s.clean()", "s.chomp()"], "s.strip()"),
    ("What does `__name__ == '__main__'` indicate?", ["File is being imported", "File is being run directly as a script", "Class is public", "Module has errors"], "File is being run directly as a script"),
    ("Which function converts a JSON string to a Python dictionary?", ["json.loads()", "json.dumps()", "json.parse()", "json.to_dict()"], "json.loads()"),
    ("What is the default return value of a Python function with no return statement?", ["0", "False", "None", "undefined"], "None"),
    ("What happens when you pass a mutable object like a list as a default argument?", ["It is recreated every call", "The same object is shared across calls", "A syntax error is thrown", "It converts to a tuple"], "The same object is shared across calls"),
    ("What is the purpose of `super()` in class inheritance?", ["Calls a function on the child class", "Refers to the parent/superclass object", "Initializes a thread", "Imports a module"], "Refers to the parent/superclass object"),
    ("Which operator performs matrix multiplication in Python 3.5+?", ["*", "**", "@", "x"], "@"),
]

JAVA_QUESTIONS = [
    ("Which component of Java is responsible for executing bytecode?", ["JDK", "JRE", "JVM", "JIT only"], "JVM"),
    ("What is the default value of a boolean instance variable in Java?", ["true", "false", "0", "null"], "false"),
    ("Which access modifier makes a member accessible only within its own class?", ["public", "protected", "default", "private"], "private"),
    ("Which collection class is thread-safe by default?", ["ArrayList", "Vector", "HashMap", "HashSet"], "Vector"),
    ("What is the superclass of all classes in Java?", ["java.lang.System", "java.lang.Object", "java.lang.Class", "java.lang.Super"], "java.lang.Object"),
    ("Which keyword prevents a class from being inherited?", ["static", "abstract", "final", "const"], "final"),
    ("What is the difference between `String`, `StringBuilder`, and `StringBuffer`?", ["String is mutable", "StringBuilder is thread-safe and immutable", "StringBuffer is synchronized; StringBuilder is not synchronized", "All three are identical"], "StringBuffer is synchronized; StringBuilder is not synchronized"),
    ("Which exception is unchecked (inherits from RuntimeException)?", ["IOException", "SQLException", "NullPointerException", "ClassNotFoundException"], "NullPointerException"),
    ("What happens during Java garbage collection?", ["Memory occupied by unreachable objects is reclaimed", "Classes are recompiled", "Files are closed", "Threads are terminated"], "Memory occupied by unreachable objects is reclaimed"),
    ("Which interface must be implemented to sort a list using `Collections.sort(list)` without a comparator?", ["java.lang.Cloneable", "java.lang.Comparable", "java.io.Serializable", "java.lang.Iterable"], "java.lang.Comparable"),
    ("What is the purpose of the `volatile` keyword in Java?", ["Prevents inheritance", "Guarantees visibility of variable changes across threads", "Makes variable immutable", "Allocates memory on the heap"], "Guarantees visibility of variable changes across threads"),
    ("Can an abstract class have a constructor in Java?", ["No, never", "Yes, invoked via super() in subclasses", "Only private constructors", "Only static constructors"], "Yes, invoked via super() in subclasses"),
    ("Which keyword is used to call a parent constructor?", ["parent()", "base()", "super()", "this()"], "super()"),
    ("What is the size of an `int` primitive in Java?", ["16 bits", "32 bits", "64 bits", "Depends on OS"], "32 bits"),
    ("What is the time complexity of `HashMap.get(key)` under optimal conditions?", ["O(1)", "O(n)", "O(log n)", "O(n log n)"], "O(1)"),
    ("Which method is the entry point of a standard Java application?", ["public void main(String[] args)", "public static void main(String[] args)", "static void start(String[] args)", "public int main()"], "public static void main(String[] args)"),
    ("Can an interface have concrete methods in Java 8+?", ["No, only abstract methods", "Yes, using default or static keywords", "Only private static methods", "Only through inner classes"], "Yes, using default or static keywords"),
    ("What does the `transient` keyword do on a variable?", ["Prevents thread serialization", "Excludes variable from standard serialization", "Makes it accessible to all classes", "Compiles to native code"], "Excludes variable from standard serialization"),
    ("Which package is imported automatically into every Java compilation unit?", ["java.util", "java.io", "java.lang", "java.net"], "java.lang"),
    ("What is autoboxing in Java?", ["Automatic conversion between primitives and their wrapper classes", "Compressing JAR files", "Creating thread pools", "Dynamic bytecode generation"], "Automatic conversion between primitives and their wrapper classes"),
    ("Which memory area stores objects in the JVM?", ["Method Area", "Call Stack", "Heap Memory", "Program Counter Register"], "Heap Memory"),
    ("What is the result of `1.0 / 0.0` in Java for double?", ["Throws ArithmeticException", "Infinity", "NaN", "0.0"], "Infinity"),
    ("Which collection implements a FIFO queue in Java?", ["Stack", "ArrayDeque / LinkedList as Queue", "TreeSet", "HashMap"], "ArrayDeque / LinkedList as Queue"),
    ("What does `equals()` check in `Object` by default?", ["Memory reference identity", "Field-by-field equality", "Hash code values", "Class name match"], "Memory reference identity"),
    ("Which statement about Java multiple inheritance of classes is true?", ["Java supports multiple class inheritance", "Java prohibits multiple class inheritance, but allows implementing multiple interfaces", "Java allows multiple inheritance only for abstract classes", "Supported using the extends keyword with comma"], "Java prohibits multiple class inheritance, but allows implementing multiple interfaces"),
    ("What is the purpose of the `try-with-resources` statement in Java 7+?", ["Catches multiple exceptions in one catch block", "Automatically closes resources implementing AutoCloseable", "Improves performance of try blocks", "Avoids checked exceptions"], "Automatically closes resources implementing AutoCloseable"),
    ("What does the `@Override` annotation do?", ["Forces the method to be overridden by subclasses", "Causes compiler check verifying method overrides a superclass method", "Makes method final", "Speeds up reflection"], "Causes compiler check verifying method overrides a superclass method"),
    ("Which map implementation maintains insertion order?", ["TreeMap", "HashMap", "LinkedHashMap", "ConcurrentHashMap"], "LinkedHashMap"),
    ("What does `final` on a variable imply?", ["Value cannot be reassigned once initialized", "Variable cannot be read from other threads", "Variable is stored in registers", "Variable cannot be null"], "Value cannot be reassigned once initialized"),
    ("Which thread method pauses execution without losing existing locks?", ["Thread.sleep()", "Object.wait()", "Thread.yield()", "Thread.stop()"], "Thread.sleep()"),
    ("What is a functional interface in Java?", ["An interface with no methods", "An interface with exactly one abstract method", "An interface containing only static methods", "An interface implemented by lambdas only in Java 7"], "An interface with exactly one abstract method"),
    ("Which tool compiles Java source files into bytecode?", ["java", "javac", "javap", "javadoc"], "javac"),
    ("What is the output of `\"abc\".substring(1, 2)`?", ["\"a\"", "\"b\"", "\"ab\"", "\"bc\""], "\"b\""),
    ("What is the role of the JIT (Just-In-Time) compiler?", ["Parses source code into AST", "Translates frequently executed bytecode into native machine code at runtime", "Cleans unused memory", "Validates digital signatures"], "Translates frequently executed bytecode into native machine code at runtime"),
    ("Which class is used for high-precision arbitrary arithmetic in Java?", ["java.lang.Double", "java.math.BigDecimal", "java.lang.Float", "java.math.ExactNumber"], "java.math.BigDecimal"),
]

JAVASCRIPT_QUESTIONS = [
    ("Which keyword declares a block-scoped variable that cannot be reassigned?", ["var", "let", "const", "def"], "const"),
    ("What is the result of `typeof null` in JavaScript?", ["'null'", "'object'", "'undefined'", "'boolean'"], "'object'"),
    ("What is a closure in JavaScript?", ["A function bundled with references to its surrounding lexical environment", "A syntax error in async functions", "A method to close browser tabs", "A JSON serialization method"], "A function bundled with references to its surrounding lexical environment"),
    ("What does `===` check compared to `==`?", ["Values after type coercion", "Both value and data type without type coercion", "Reference equality only", "String length equality"], "Both value and data type without type coercion"),
    ("Which array method creates a new array with elements that pass a test condition?", ["map()", "filter()", "forEach()", "reduce()"], "filter()"),
    ("What is the output of `console.log(1 + '2' + 3)`?", ["'123'", "6", "'15'", "NaN"], "'123'"),
    ("What is the Event Loop responsible for in JavaScript runtime?", ["Rendering CSS styles", "Coordinating the execution of synchronous code, microtasks, and macrotasks", "Compiling TypeScript", "Managing DOM garbage collection"], "Coordinating the execution of synchronous code, microtasks, and macrotasks"),
    ("Which Promise method waits for all promises to settle, whether fulfilled or rejected?", ["Promise.all()", "Promise.race()", "Promise.allSettled()", "Promise.any()"], "Promise.allSettled()"),
    ("What is the value of `this` in an arrow function?", ["Bound to the caller object at invocation", "Lexically inherited from the enclosing execution context", "Always points to window / global", "Always undefined"], "Lexically inherited from the enclosing execution context"),
    ("What does `Array.prototype.reduce()` do?", ["Reduces the array length by one", "Applies an accumulator function to each element to produce a single value", "Filters falsy values", "Flattens nested arrays"], "Applies an accumulator function to each element to produce a single value"),
    ("Which operator is the nullish coalescing operator?", ["||", "&&", "??", "?."], "??"),
    ("What is the optional chaining operator in JavaScript?", ["?.", "??", "::", "->"], "?."),
    ("What does `JSON.stringify()` do?", ["Parses a JSON string into an object", "Converts a JavaScript value to a JSON string", "Formats HTML code", "Encodes a URI"], "Converts a JavaScript value to a JSON string"),
    ("What is the difference between `null` and `undefined`?", ["They are identical in type and value", "`undefined` means a variable is declared but unassigned; `null` represents intentional absence of value", "`null` is a primitive, `undefined` is an object", "`undefined` can be reassigned in strict mode"], "`undefined` means a variable is declared but unassigned; `null` represents intentional absence of value"),
    ("What does `[1, 2, 3].map(x => x * 2)` return?", ["[1, 4, 9]", "[2, 4, 6]", "12", "undefined"], "[2, 4, 6]"),
    ("How do you stop event propagation in the DOM?", ["event.preventDefault()", "event.stopPropagation()", "event.halt()", "return false"], "event.stopPropagation()"),
    ("What does `event.preventDefault()` do in an event handler?", ["Stops other listeners from running", "Prevents the default browser behavior (e.g. form submission)", "Detaches the listener", "Logs the event"], "Prevents the default browser behavior (e.g. form submission)"),
    ("Which method schedules a function to run after a minimum number of milliseconds?", ["setImmediate()", "requestAnimationFrame()", "setTimeout()", "delay()"], "setTimeout()"),
    ("What does the `async` keyword placed before a function declaration do?", ["Makes the function synchronous", "Causes the function to automatically return a Promise", "Runs the function in a web worker", "Prevents errors from being thrown"], "Causes the function to automatically return a Promise"),
    ("Which Web API is used for making asynchronous HTTP requests in modern browsers?", ["XMLHttpRequest only", "fetch()", "http.request()", "axios.builtIn()"], "fetch()"),
    ("What is the purpose of `Object.freeze()`?", ["Shallowly makes an object immutable (prevents adding, removing, or modifying properties)", "Deeply freezes all nested objects", "Compresses object memory", "Converts object to string"], "Shallowly makes an object immutable (prevents adding, removing, or modifying properties)"),
    ("What does `NaN === NaN` evaluate to?", ["true", "false", "undefined", "TypeError"], "false"),
    ("How do you check if a value is NaN accurately?", ["value == NaN", "Number.isNaN(value)", "value === NaN", "typeof value === 'NaN'"], "Number.isNaN(value)"),
    ("What is the output of `Boolean('')`?", ["true", "false", "undefined", "NaN"], "false"),
    ("Which statement about JavaScript `Set` is true?", ["Maintains duplicate values", "Stores unique values of any type", "Keys and values must be strings", "Only accepts numbers"], "Stores unique values of any type"),
    ("What is the spread syntax in JavaScript?", ["...", "::", "=>", "**"], "..."),
    ("How do you create a shallow copy of an object using spread syntax?", ["const copy = { ...original };", "const copy = original.spread();", "const copy = [...original];", "const copy = Object.spread(original);"], "const copy = { ...original };"),
    ("Which method checks if an array includes a specific element?", ["array.has()", "array.contains()", "array.includes()", "array.findItem()"], "array.includes()"),
    ("What is the purpose of `localStorage` in browsers?", ["Temporary session storage cleared on tab close", "Persistent key-value storage across browser sessions", "Server-side cache", "Encrypted cookie store"], "Persistent key-value storage across browser sessions"),
    ("What is hoisting in JavaScript?", ["Moving HTML tags to the body", "Declarations of functions and `var` variables are processed before code execution", "Garbage collection pass", "Bundling modules"], "Declarations of functions and `var` variables are processed before code execution"),
    ("What is the result of `0.1 + 0.2 === 0.3` in JavaScript?", ["true", "false (due to IEEE 754 floating point representation)", "NaN", "undefined"], "false (due to IEEE 754 floating point representation)"),
    ("Which method transforms an object into an array of `[key, value]` pairs?", ["Object.keys()", "Object.values()", "Object.entries()", "Object.pairs()"], "Object.entries()"),
    ("What is a Symbol in JavaScript?", ["A unique, immutable primitive value often used as object property keys", "A graphical icon", "A regular expression class", "A DOM node"], "A unique, immutable primitive value often used as object property keys"),
    ("What does the `new` operator do when instantiating a function?", ["Creates a blank object, binds `this`, links prototypes, and returns the object", "Clones an existing object", "Runs in a background thread", "Validates parameter types"], "Creates a blank object, binds `this`, links prototypes, and returns the object"),
    ("Which statement correctly imports a default export in ES Modules?", ["import default from 'module'", "import myModule from './module.js'", "require('./module.js')", "include './module.js'"], "import myModule from './module.js'"),
]


def seed_database(db=None):
    if db is None:
        print("Connecting to database and ensuring indexes...")
        try:
            ensure_indexes()
        except Exception:
            pass
        db = mongo_db()

    print(f"Seeding {len(SKILLS)} core skills...")
    for skill in SKILLS:
        db.skills.update_one({"slug": skill["slug"]}, {"$set": {**skill, "updated_at": datetime.now(timezone.utc)}}, upsert=True)
    print("Skills seeded successfully.")

    total_questions = 0
    now = datetime.now(timezone.utc)

    skill_questions = [
        ("python", PYTHON_QUESTIONS),
        ("java", JAVA_QUESTIONS),
        ("javascript", JAVASCRIPT_QUESTIONS),
    ]

    for skill_slug, questions in skill_questions:
        print(f"Seeding {len(questions)} questions for skill: {skill_slug}...")
        for idx, (prompt, options, correct) in enumerate(questions, start=1):
            q_id = f"{skill_slug}-q-{idx:03d}"
            doc = {
                "id": q_id,
                "skill_id": skill_slug,
                "prompt": prompt,
                "options": options,
                "correct_option": correct,
                "difficulty": "intermediate" if idx > 15 else "beginner",
                "active": True,
                "version": 1,
                "created_at": now,
            }
            db.questions.update_one({"id": q_id}, {"$set": doc}, upsert=True)
            total_questions += 1

    print(f"Successfully seeded {total_questions} total assessment questions across skills.")


if __name__ == "__main__":
    seed_database()
