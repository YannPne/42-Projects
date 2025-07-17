/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_substr.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 15:57:43 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 18:29:42 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_substr(const char *s, unsigned int start, size_t len)
{
	unsigned int	i;
	unsigned int	j;
	char			*subs;

	j = 0;
	i = 0;
	if (start > (unsigned int)ft_strlen(s))
	{
		subs = (char *)malloc(sizeof(char));
		subs[0] = '\0';
		return (subs);
	}
	while (s[start + i] && len--)
		i++;
	subs = (char *)malloc((i + 1) * sizeof(char));
	if (!subs)
		return (NULL);
	while (s[start] && j < i)
	{
		subs[j++] = s[start++];
	}
	subs[j] = '\0';
	return (subs);
}
/*
#include <stdio.h>
#include <stdlib.h>

char *ft_substr(const char *str, unsigned int start, size_t len);

int main() {
    const char *chaine = "Exemple de sous-chaînage";
    unsigned int debut = 8;  // Position de départ (0-indexed)
    size_t longueur = 4;     // Longueur de la sous-chaîne
    
    // Appel de la fonction ft_substr pour extraire une sous-chaîne
    char *sous_chaine = ft_substr(chaine, debut, longueur);
    
    if (sous_chaine == NULL) {
        fprintf(stderr, "L'extraction de sous-chaîne a échoué.\n");
        return 1;  // Quitte le programme avec une erreur
    }
    
    printf("Sous-chaîne extraite : %s\n", sous_chaine);
    
    // N'oubliez pas de libérer la mémoire allouée pour la sous-chaîne
    free(sous_chaine);
    
    return 0;
}
*/
