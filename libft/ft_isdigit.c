/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   isdigit.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 12:29:36 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 12:29:38 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	ft_isdigit(int c)
{
	if (c <= '9' && c >= '0')
		return (1);
	return (0);
}

/*
#include <stdio.h>
#include <ctype.h>

int main() {
    char ch1 = '5';
    char ch2 = 'A';
    
    if (isdigit(ch1)) {
        printf("%c est un chiffre décimal.\n", ch1);
    } else {
        printf("%c n'est pas un chiffre décimal.\n", ch1);
    }
    
    if (isdigit(ch2)) {
        printf("%c est un chiffre décimal.\n", ch2);
    } else {
        printf("%c n'est pas un chiffre décimal.\n", ch2);
    }
    
    return 0;
}
*/
