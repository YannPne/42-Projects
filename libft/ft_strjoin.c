/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strjoin.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 15:57:59 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 18:31:48 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strjoin(char const *s1, char const *s2)
{
	char	*mot;
	int		i;

	mot = malloc((ft_strlen(s1) + ft_strlen(s2) + 1) * sizeof(char));
	if (!mot)
		return (NULL);
	i = 0;
	while (*s1)
		mot[i++] = *s1++;
	while (*s2)
		mot[i++] = *s2++;
	mot[i] = '\0';
	return (mot);
}
/*
#include <stdio.h>

int main() {
    const char *chaine1 = "Bonjour,";
    const char *chaine2 = "le monde!";

    // Appel de la fonction ft_strjoin pour joindre les deux chaînes
    char *chaine_jointe = ft_strjoin(chaine1, chaine2);

    if (chaine_jointe == NULL) {
        fprintf(stderr, "La jointure de chaînes a échoué.\n");
        return 1;  // Quitte le programme avec une erreur
    }

    printf("Chaîne jointe : %s\n", chaine_jointe);

    // N'oubliez pas de libérer la mémoire allouée pour la chaîne jointe
    free(chaine_jointe);

    return 0;
}
*/
