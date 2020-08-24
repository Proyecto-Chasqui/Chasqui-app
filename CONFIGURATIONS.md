# CHASQUI APP

Las configuraciones descriptas debajo solo son para el entorno **Android**, debido que la aplicación esta desarrollada solo bajo el enfoque de **Android 5 +** por lo tanto no se asegura que funcione para **IOS**.

## Requerimientos
### Desarrollo
1. Expo SDK 37
2. Node 14.8.0
3. Yarn

### Creación de apk
1. Google Cloud Services: MAPSDK, GeocodingServices, Firebase.
2. Cuenta en **[expo.io](https://expo.io/)**.

## Instalación de Expo
1. Instalar **[NodeJS 14.8.0](https://nodejs.org/es/)** o superior.
2. Abrir una consola/terminal y ejecutar **npm install expo-cli --global**
3. Crease una cuenta en **[expo.io](https://expo.io/)**, esto permitirá crear el apk via expo CLI.
4. Instalar Yarn, abrir una consola/terminal y ejecutar **npm install -g yarn**.

## Instalación de dependencias
Luego de bajar el repositorio y descargar las dependencias básicas mencionadas en la sección **Instalación de Expo** ejecute el siguiente comando en una consola/terminal ubicada en la raíz de la carpeta.
- Yarn install

## Configuración del proyecto
Para crear un entorno de desarrollo funcional se deberán configurar los siguientes archivos dentro del proyecto.

1. Configurar los siguientes campos en **App.Json** ubicada en la raiz del proyecto.
	- **"owner": "user_logged_in_expo"**: cambiarla por el nombre del usuario creado en expo.io, esto permitirá crear el apk via expo CLI
2. Configurar los siguientes campos en **Globals.js** ubicada en **./app**
	- **BASE_URL**: Colocar la ruta del Backend de la plataforma con la cual desea conectase.

## Executar el proyecto
Para levantar un servidor local de la aplicación, deberá estar en la carpeta raiz del proyecto y ejecutar en la consola/terminal **expo start**

Para ejecutarlo en un emulador o dispositivo físico, se deberá bajar la siguiente **[aplicación de expo](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www)**

## Configuración de servicios Google Cloud.
Para poder tener completamente operativa la aplicación tanto en entorno de desarrollo como en producción, se deberan configurar los siguientes servicios de GoogleCloud.

1. **Geolocalización**: se deberá configurar y obtener la **[apikey de Gelocalización de google](https://maplink.global/es/blog/como-obtener-google-maps-api-key/)**, *tenga en cuenta que esta key requiere de una cuenta de google con facturación habilitada*. Una vez obtenida la key agregarla donde se describe a continuación,
	- en **Globals.js** ubicada en **./app**, en el campo **GEO_APIKEY** colocar la Api Key obtenida.
2. **Notificaciones**: La aplicación usa el sistema de FCM, por el momento expo solo soporta Android en este aspecto, para esto se deberá obtener un archivo provisto por Google Firebase, los pasos de como conseguirlo y configurarlo estan en este **[link](https://docs.expo.io/guides/using-fcm/)**, por favor seguir todas las instrucciones, puede ignorar la sección **Bare projects** si pretende usar expo como creador del apk.
3. **MAPSDK**: *Esta clave no es necesaria en entorno de desarrollo*, pero para **creación de apk es obligatoria**. Para poder visualizar los mapas de google en las secciones que lo requieran, se deberá obtener la apikey de **Maps Sdk for Android**, la obtención es similar a la de **Geolocalización** sin embargo esta api **no** requiere facturación. Una vez obtenida la Key agregarla en **app.json** ubicado en la raiz del proyecto en la linea que se muestra a continuación.

_ _ _
      ...
      "config": {
        "googleMaps": { "apiKey": "yourSDKMAPSkey" }
     }
     ...
_ _ _

## Configuración de legales
Esta sección solo es **relevante** si se pretende levantar la aplicación a **app store**.

La aplicación tiene dos secciones de legales, **Politicas de privacidad** y **Términos y condiciones**, estas secciones son WebViews configuradas para mostrar paginas responsive, la dirección de las mismas deberán ser configuradas en el archivo **Globals.js** en la carpeta **./app** en las lineas que se muestran a continuación:


_ _ _
    TERMS_AND_CONDITIONS_URL:"",
    PRIVACY_POLICY_URL:"",
_ _ _

Si se dejan sin url, la aplicación mostrara una página en el cual informa que no se posee aun estos datos, pero no bloqueara el uso de la misma.

## Creación de apk

Para crear el apk completamente funcional se debe tener completamente configurados los archivos app.json y Globals.js.

Debe estar logeado con la cuenta expo en **expo CLI**, para logearse debe ejecutar en una consola/terminal **expo login** e ingresar sus credenciales, recuerde que el usuario que acceda debe ser el mismo que esta declarado en **app.json** como se explica en la sección **Configuración del proyecto**.

Una vez logeado y configurados los archivos, se debe tener corriendo el proyecto en una sesión de **expo start** y en una consola/terminal **paralela** ubicada en la raíz del proyecto ejecutar **expo build:android**, esto ejecutara el proceso de creación del APK para android en los servidores de expo.io, para acceder al resultado deberá ingresar a **https://expo.io/dashboard/** y descargar la apk generada.
Para mas información puede leer esta guia **[Building standalone apps](https://docs.expo.io/distribution/building-standalone-apps/)**.

