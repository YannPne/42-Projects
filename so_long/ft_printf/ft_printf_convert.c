/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_printf_convert.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/08 12:15:42 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/08 12:17:24 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_printf.h"

void	ft_putnbr(unsigned int n, int *i)
{
	char	c;

	if (n > 9)
	{
		ft_putnbr(n / 10, i);
		ft_putnbr(n % 10, i);
	}
	else
	{
		c = n + '0';
		write(1, &c, 1);
		*i = *i + 1;
	}
}

int	ft_printchar(char c)
{
	write(1, &c, 1);
	return (1);
}

int	ft_printstr(char *str)
{
	int	i;

	if (!str)
		return (ft_printstr("(null)"));
	i = -1;
	while (str[++i])
		write(1, &str[i], 1);
	return (i);
}

int	ft_printnumber(int nb)
{
	int	i;

	i = 0;
	if (nb == -2147483648)
		return (write(1, "-2147483648", 11));
	if (nb < 0)
	{
		nb = -nb;
		write(1, "-", 1);
		i = i + 1;
	}
	ft_putnbr(nb, &i);
	return (i);
}

int	ft_printunsigned(unsigned int nb)
{
	int	i;

	i = 0;
	ft_putnbr(nb, &i);
	return (i);
}
