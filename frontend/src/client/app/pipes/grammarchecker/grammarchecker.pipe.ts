import { Pipe, PipeTransform } from '@angular/core';
import { dict } from './dict_contraloria';
import { last_termination } from './last_termination_rules';
/**
* This class represents the main pipe component.
*/
@Pipe({name: 'grammarchecker'})
export class GrammarcheckerPipe implements PipeTransform {
	/* MAIN TRANSFOMATION */
	transform(value:string, args:string[]) : any {
		var words = value.toLocaleLowerCase().split(" ");
		var words_checked = [];
		for(let i=0; i<words.length; i++){
			let cota_central = (typeof dict[words[i].length] != "undefined") ? dict[words[i].length.toString()] : undefined;
			let word = {
				dist: 9999,
				word: words[i]
			};
			for(let key in cota_central){
				var dist = this.levensthein(words[i],key);
				if(dist < word.dist && dist < 3){
					word.dist = dist;
					word.word = key;
					if(dist == 0) break;
				}
			}
			// Si la palabra es extraña aplicamos reglas del español
			// Revisamos el termino de la palabra si concuerda con alguna de las reglas gramaticales de termino
			if(words[i].length < 3 && word.dist != 0) {
				word = {
					dist: 9999,
					word: words[i]
				};
			}
			if(word.dist == 9999){
				for(let key in last_termination){
					if(word.word.endsWith(key)) word.word = last_termination[key](word.word);
				}
			}
			words_checked.push(word.word);
		}
		return words_checked.join(" ").trim();
	}
	private levensthein(word: string,compare: string){
		if (word.length === 0) return compare.length
		if (compare.length === 0) return word.length
		let tmp, i, j, prev, val, row
		// swap to save some memory O(min(word,compare)) instead of O(word)
		if (word.length > compare.length) {
		  tmp = word
		  word = compare
		  compare = tmp
		}
	  
		row = Array(word.length + 1)
		// init the row
		for (i = 0; i <= word.length; i++) {
		  row[i] = i
		}
	  
		// fill in the rest
		for (i = 1; i <= compare.length; i++) {
		  prev = i
		  for (j = 1; j <= word.length; j++) {
			if (compare[i - 1] === word[j - 1]) {
			  val = row[j - 1] // match
			} else {
			  val = Math.min(row[j - 1] + 1, // substitution
					Math.min(prev + 1,     // insertion
							 row[j] + 1))  // deletion
			}
			row[j - 1] = prev
			prev = val
		  }
		  row[word.length] = prev
		}
		return row[word.length]
	}
}