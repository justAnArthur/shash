<!--- NOTE: use following code to access user and userId-->

```javascript
import { useAuth } from "src/lib/composables/useAuth";

const { userLocalStorage } = useAuth();
const userId = userLocalStorage.id;
console.log(userId);
```
