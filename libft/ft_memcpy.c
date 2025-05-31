/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   memcpy.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 12:23:06 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 12:23:40 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	*ft_memcpy(void *dest, const void *src, size_t n)
{
	char	*conv_dest;

	conv_dest = (char *)dest;
	if (!conv_dest && !(char *)src)
		return (NULL);
	while (n--)
		*conv_dest++ = *(char *)src++;
	return (dest);
}

/*
int main(void)
{
    const char *srcString = "Hello, World!";
    char destString[50]; // Destination avec une taille suffisamment grande

    // Copie jusqu'au caractère 'o' (inclus) ou jusqu'à la fin de la chaîne
    char *result = ft_memccpy(destString, srcString, 'o', strlen(srcString) + 1);

    if (result != NULL) {
        printf("Caractère trouvé : %c\n", *result);
    } else {
        printf("Caractère non trouvé.\n");
    }

    // Affiche le contenu de destination
    printf("Destination : %s\n", destString);

    return 0;
}
*/
