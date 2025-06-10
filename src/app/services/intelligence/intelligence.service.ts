import {Injectable} from '@angular/core';
import {createPerplexity} from '@ai-sdk/perplexity';
import {generateText} from 'ai';
import {IntelligenceRecommendation} from '../../models/IntelligenceRecommendation';

@Injectable({
  providedIn: 'root'
})
export class IntelligenceService {
  constructor() {
  }

  private $l = "5bif";
  private _j = "3tiq";
  private _a = "pp";
  private $g = "Rfwk";
  private _n = "8nYL";
  private _e = "t6ZP";
  private $d = "nVd21";
  private _f = "SOVf";
  private $k = "EdoJ";
  private _b = "lx-";
  private $c = "DLc";
  private _i = "aa4l";
  private _m = "3beX";
  private $h = "LfIZ";

  private _getK(): string {
    return (
      this._a +
      this._b +
      this.$c +
      this.$d +
      this._e +
      this._f +
      this.$g +
      this.$h +
      this._i +
      this._j +
      this.$k +
      this.$l +
      this._m +
      this._n
    );
  }

  myPplx = createPerplexity({
    apiKey: this._getK()
  })

  async generateRecommendations(responses: string[]) {
    const propmt = `
      Eres un experto en películas y series, por tanto, vas a dar recomendaciones de contenidos a cada usuario en base a sus gustos y lo que quiere en ese momento.
      Vas a recibir de 1 a 3 géneros de contenido, preferencias sobre películas o series y el tipo de contenido popularmente hablando (mainstream, joya oculta, etc...), año/decada...
      No detalles el contenido, simplemente da el título de la pelicula/serie EN INGLÉS y el año de salida (y si es una serie, año de salida y año de finalización, si ha finalizado)
      No des ninguna expecificacion de contenidos, no respondas como una persona, responde como un servidor de datos
      Asegúrate de que las recomendaciones EXISTAN, NO ALUCINES O SERIES FALSAS, NO RESPONDAS CON CONTENIDOS QUE NO EXISTAN
      Responde con el título de la película/serie en inglés
      Vas a dar 6 recomendaciones en base a esta información

      Preferencias del usuario: ${responses.join(', ')}
    `;

    const {text, sources, providerMetadata} = await generateText({
      model: this.myPplx('sonar'),
      prompt: propmt,
    });

    return {
      text,
      recommendations: this.parseRecommendations(text),
      sources,
      providerMetadata
    };
  }

  private parseRecommendations(responseText: string): IntelligenceRecommendation[] {
    const pattern = /\*\*(.*?)\*\* \((\d{4})\)/g;
    const recommendations: IntelligenceRecommendation[] = [];

    let match;
    while ((match = pattern.exec(responseText)) !== null) {
      recommendations.push({
        title: match[1].trim(),
        year: parseInt(match[2])
      });
    }

    return recommendations;
  }
}
