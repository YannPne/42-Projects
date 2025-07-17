/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   bzero.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 12:24:46 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 12:27:27 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	ft_bzero(void *s, size_t len)
{
	char	*convert;

	convert = s;
	while (len--)
		*convert++ = '\0';
}
/*
#include <stdio.h>
#include <string.h>

int main(void)
{
    char buffer[10];

    // Remplir buffer avec des données
    for (int i = 0; i < 10; i++)
        buffer[i] = 'A' + i;

    // Afficher le contenu de buffer
    printf("Avant memset : %s\n", buffer);

    // Utiliser memset pour effacer buffer
    memset(buffer, 0, sizeof(buffer));

    // Afficher le contenu de buffer après avoir utilisé memset
    printf("Après memset : %s\n", buffer);

    return 0;
}
*/
