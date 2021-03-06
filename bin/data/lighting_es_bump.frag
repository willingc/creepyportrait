// Bump mapping from http://www.ozone3d.net/tutorials/bump_mapping.php
// Diffuse and specular lighting from http://www.arcsynthesis.org/gltut/
precision highp float;

uniform sampler2D diffuseTex;
uniform sampler2D specularTex;
uniform sampler2D ambientTex;
uniform sampler2D normalTex;

varying vec2 texCoordVarying;
varying vec3 lightDirection;
varying vec3 cameraDirection;

vec4 lightAmbient = vec4(0.075, 0.0, 0.0, 1.0); 
vec4 lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
vec4 lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
float materialShininess = 0.4;

void main(){
	vec4 materialDiffuse = texture2D(diffuseTex, texCoordVarying);
	vec4 materialAmbient = texture2D(ambientTex, texCoordVarying);
	vec4 materialSpecular = texture2D(specularTex, texCoordVarying);

	vec3 normalizedLight = normalize(lightDirection);
	vec3 normalizedCamera = normalize(cameraDirection);

	vec3 normal = normalize(texture2D(normalTex, texCoordVarying).xyz * 2.0 - 1.0);

	float lambert = clamp(dot(normal, normalizedLight), 0.0, 1.0);

	vec3 halfAngle = normalize(normalizedLight + normalizedCamera);
	float angleNormalHalf = acos(dot(halfAngle, normal));
	float exponent = angleNormalHalf / materialShininess;
	exponent = -(exponent * exponent);
	float gaussian = exp(exponent);
	gaussian = lambert != 0.0 ? gaussian : 0.0;

	gl_FragColor = lightAmbient * materialAmbient +
				   lightDiffuse * materialDiffuse * lambert +
				   lightSpecular * materialSpecular * gaussian;
}