import { Item, LivrosResultado } from './../../models/interfaces';
import { LivroService } from './../../service/livro.service';
import { Component} from '@angular/core';
import { switchMap, map, tap, filter, debounceTime, catchError, throwError, EMPTY, of } from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { FormControl } from '@angular/forms';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl;
  mensagemErro: string = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) { }

  totalDeLivros$ = this.campoBusca.valueChanges
  .pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo inicial')),
    switchMap((valorDigitado) => this.service.buscar
    (valorDigitado)),
    map((resultado) => this.livrosResultado = resultado),
    catchError(erro => {
      console.log(erro)
      return of()
    })
  );

  livrosEncontrados$ =  this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('Fluxo inicial')),
      switchMap((valorDigitado) => this.service.buscar
      (valorDigitado)),
      tap((retornoAPI) => console.log(retornoAPI)),
      map(resultado => resultado.items ?? []),
      map((items) =>  this.livrosResultadoParaLivros(items)),
      catchError((erro) => {
        // this.mensagemErro = 'Ops, ocorreu um erro, Recarrega a página'
        // return EMPTY
        console.log(erro)
        return throwError(() => new Error(this.mensagemErro = 'Ops, ocorreu um erro, Recarrega a página'))
      })
    );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

}





