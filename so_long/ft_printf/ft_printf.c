/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_printf.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/08 12:08:34 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/08 12:11:36 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_printf.h"
#include <limits.h>

int	ft_printpointeur(unsigned long long address)
{
	char	*base;
	int		e;
	int		nbr_final[100];
	int		i;

	i = 0;
	base = "0123456789abcdef";
	while (address)
	{
		nbr_final[i] = address % 16;
		address = address / 16;
		i++;
	}
	e = i;
	if (i <= 0)
		return (ft_printstr("(nil)"));
	ft_printstr("0x");
	while (--i >= 0)
		ft_printchar(base[nbr_final[i]]);
	return (e + 2);
}

int	ft_printhexa(unsigned int nb, int maj)
{
	char	*base;
	int		e;
	int		nbr_final[100];
	int		i;

	i = 0;
	base = "0123456789abcdef";
	if (nb == 0)
		return (ft_printchar('0'));
	while (nb)
	{
		nbr_final[i] = nb % 16;
		nb = nb / 16;
		i++;
	}
	e = i;
	while (--i >= 0)
	{
		if (maj && base[nbr_final[i]] <= 'z' && base[nbr_final[i]] >= 'a')
			ft_printchar(base[nbr_final[i]] - ' ');
		else
			ft_printchar(base[nbr_final[i]]);
	}
	return (e);
}

int	ft_type(va_list args, char c)
{
	unsigned long long	address;

	if (c == 'c')
		return (ft_printchar(va_arg(args, int)));
	if (c == 's')
		return (ft_printstr(va_arg(args, char *)));
	if (c == 'd' || c == 'i')
		return (ft_printnumber(va_arg(args, int)));
	if (c == 'u')
		return (ft_printunsigned(va_arg(args, unsigned int)));
	if (c == 'x')
		return (ft_printhexa(va_arg(args, unsigned int), 0));
	if (c == 'X')
		return (ft_printhexa(va_arg(args, unsigned int), 1));
	if (c == 'p')
	{
		address = (unsigned long long)va_arg(args, unsigned long long);
		return (ft_printpointeur(address));
	}
	if (c == '%')
		return (write (1, "%", 1));
	return (0);
}

int	ft_printf(const char *str, ...)
{
	int		i;
	int		print_len;
	va_list	args;

	i = 0;
	print_len = 0;
	va_start(args, str);
	while (str[i])
	{
		if (str[i] == '%')
		{
			print_len += ft_type(args, str[i + 1]);
			i++;
		}
		else
			print_len += ft_printchar(str[i]);
		i++;
	}
	va_end(args);
	return (print_len);
}
