
#! /usr/bin/perl
# dump_directory - Output contents of all directories recursively from base to screen

@ARGV = "." unless @ARGV;
use File::Find;
use File::Basename;
use JSON;

$base_dir = $ARGV[0];
my @cardfiles = ();

#find sub { print $File::Find::name, -d && '/', "\n" }, @ARGV; 
find sub { 
		
		if (-d $File::Find::name) {
		    
		} else {
			my $filename = basename($File::Find::name);
			unless ( $filename =~ /^~/ ) {
			    my $rec = {
				'path' => $File::Find::dir,
				'fname' => $_
			    };
			    push(@cardfiles, $rec);
			}
		}
	}, @ARGV; 
$json = JSON->new->allow_nonref;
print $json->pretty->encode( \@cardfiles ); # pretty-printing

