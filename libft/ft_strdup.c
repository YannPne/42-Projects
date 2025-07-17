/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   strdup.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 12:28:15 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 12:28:17 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strdup(const char *str)
{
	char	*duplic;
	int		i;

	i = -1;
	duplic = malloc((ft_strlen(str) + 1) * sizeof(char));
	if (!duplic)
		return (NULL);
	while (str[++i])
		duplic[i] = str[i];
	duplic[i] = '\0';
	return (duplic);
}
/*
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(void) {
    const char *original = "Hello, world!";
    char *duplic = ft_strdup(original);

    if (duplic != NULL) {
        printf("Chaîne originale : %s\n", original);
        printf("Chaîne dupliquée : %s\n", duplic);

        // N'oubliez pas de libérer la mémoire allouée par strdup
        free(duplic);
    } else {
        printf("Échec de la duplication de la chaîne.\n");
    }

    return 0;
}
*/
